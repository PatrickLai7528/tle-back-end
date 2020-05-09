import { Service } from "egg";
import { flatten } from "../utils/Tree";
import {
  IFileTreeNode,
  IRequirement,
  ITraceLink,
  ITraceLinkMatrix,
} from "./../entity/types";
import { traceLinkMocks } from "./../mock/TraceLinks";
import { v4 as uuidv4 } from "uuid";
import { ITraceLinkHistory } from "../entity/ServerOnly";

export default class TraceLinkService extends Service {
  private getCRUD() {
    return this.ctx.service.cRUD;
  }

  private getModel() {
    return this.ctx.model.TraceLinkMatrix;
  }

  public async saveTraceLinks(
    traceLinks: Omit<ITraceLink, "_id">[]
  ): Promise<string[]> {
    return await Promise.all(traceLinks.map(this.saveTraceLink.bind(this)));
  }

  public async saveTraceLink(
    traceLink: Omit<ITraceLink, "_id">
  ): Promise<string> {
    const { ctx } = this;
    return new Promise<string>(async (resolve, reject) => {
      const { _id, requirementDescription, ...others } = traceLink as any;
      ctx.service.requirement
        .saveDescriptionIfNotExists(requirementDescription)
        .then((descriptionId) => {
          ctx.model.TraceLink.create(
            { ...others, requirementDescription: descriptionId },
            (err: any, saved: ITraceLink) => {
              if (err) reject(err);
              else resolve(saved._id);
            }
          );
        });
    });
  }

  public async delete(ownerId: string, matrixId: string): Promise<void> {
    const matrix: any = await this.ctx.model.TraceLinkMatrix.findById(matrixId);
    if (!matrix) throw new Error("No Requirement Found");

    if (!matrix.relatedRepoOwnerId || matrix.relatedRepoOwnerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");

    const { _id, links } = matrix;

    await this.ctx.model.TraceLinkMatrix.deleteOne({ _id });
    await Promise.all(
      links.map((id) => this.ctx.model.TraceLink.deleteOne({ _id: id }))
    );
  }

  public async create(matrix: Omit<ITraceLinkMatrix, "_id">): Promise<string> {
    const { _id, links, ...others } = matrix as any;

    const traceLinkIds: string[] = await this.saveTraceLinks(links);

    return await this.getCRUD().create(
      {
        ...others,
        links: traceLinkIds,
      },
      this.getModel()
    );
  }

  public async addTraceLink(
    ownerId: string,
    repoName,
    newLink: ITraceLink
  ): Promise<ITraceLink> {
    const matrix: ITraceLinkMatrix = (
      await this.find({ relatedRepoName: repoName })
    )[0] as ITraceLinkMatrix;

    if (!matrix) throw new Error("No Trace Link Matrix Found");

    if (matrix.relatedRepoOwnerId && matrix.relatedRepoOwnerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");

    const traceLinkId: string = await this.saveTraceLink(newLink);
    await this.getModel().update(
      { _id: matrix._id },
      { $push: { links: traceLinkId } }
    );

    return await this.ctx.model.TraceLink.findById(traceLinkId);
  }

  public async findById(id: string): Promise<ITraceLinkMatrix | null> {
    return (await this.find({ _id: id }))[0];
  }

  public async find(
    matrix: Partial<ITraceLinkMatrix>
  ): Promise<ITraceLinkMatrix[]> {
    // return (await this.getCRUD().read(
    //   { ...matrix },
    //   this.getModel()
    // )) as ITraceLinkMatrix[];
    const res: ITraceLinkMatrix[] = (
      await this.getModel()
        .find(matrix)
        .populate({
          path: "links",
          populate: { path: "requirementDescription" },
        })
    ).map((item) => item.toObject());
    return res;
  }

  public async findByRepoName(
    ownerId: string,
    repoName: string
  ): Promise<ITraceLinkMatrix | null> {
    const matrix: ITraceLinkMatrix | null = (
      await this.find({
        relatedRepoName: repoName,
        relatedRepoOwnerId: ownerId,
      })
    )[0] as ITraceLinkMatrix;

    return matrix ? matrix : null;
  }

  public async getTraceLinkByRepoName(
    ownerId: string,
    repoName: string
  ): Promise<ITraceLink[]> {
    const matrix: ITraceLinkMatrix | null = await this.findByRepoName(
      ownerId,
      repoName
    );
    return matrix ? matrix.links || [] : [];
  }

  public async findHistoryByCommitAndRepoName(
    ownerId: string,
    repoName: string,
    commitSha: string
  ): Promise<ITraceLinkHistory | undefined> {
    // const histories: ITraceLinkHistory[] = await this.ctx.model.TraceLinkHistory.find({ ownerId, repoName });
    // return histories.filter(history => history.commit.sha === commitSha)[0];
    const commit = await this.ctx.service.repository.findCommitBySha(
      ownerId,
      repoName,
      commitSha
    );

    if (!commit) return undefined;

    return {
      _id: uuidv4(),
      commit,
      added: { traceLinks: traceLinkMocks.slice(1, 3) },
      removed: { traceLinks: traceLinkMocks.slice(4, 6) },
    };
  }

  public async findByDescriptionIdAndRepoName(
    ownerId: string,
    repoName: string,
    descriptionId: string
  ): Promise<ITraceLink[]> {
    const matrix: ITraceLinkMatrix = (
      await this.find({
        relatedRepoName: repoName,
        relatedRepoOwnerId: ownerId,
      })
    )[0];

    if (!matrix) return [];
    const traceLinks: ITraceLink[] = (matrix.links || []).filter((link) => {
      if (link && link.requirementDescription) {
        return (
          link.requirementDescription._id.toString() ===
          descriptionId.toString()
        );
      } else return false;
    });
    return traceLinks;
  }

  /**
   *
   * @param ownerId: github id
   * @param repoName: imported repo name
   * @param filename: fully quialified file name
   */
  public async findByFileAndRepoName(
    ownerId: string,
    repoName: string,
    filename: string
  ): Promise<ITraceLink[]> {
    const matrix: ITraceLinkMatrix = (
      await this.find({
        relatedRepoName: repoName,
        relatedRepoOwnerId: ownerId,
      })
    )[0];

    if (!matrix) return [];

    const traceLinks: ITraceLink[] = matrix.links || [];

    const relatedLinks: ITraceLink[] = traceLinks.filter((link) => {
      if (link.implement) {
        return link.implement.fullyQualifiedName === filename;
      } else return false;
    });

    return relatedLinks;
  }

  public async init(
    files: IFileTreeNode[],
    requirement: IRequirement,
    githubId: string
  ): Promise<Omit<ITraceLinkMatrix, "_id">> {
    const flattenFileTrees = flatten(files).filter(
      (file) => file.type === "FILE"
    );
    return {
      relatedRepoOwnerId: githubId,
      relatedRepoName: "TEMP NAME",
      links: traceLinkMocks.slice(1, 10).map((link) => {
        const { _id, ...others } = link;
        return {
          ...others,
          implement: {
            ...link.implement,
            fullyQualifiedName:
              flattenFileTrees[
                Math.round(Math.random() * (flattenFileTrees.length - 1))
              ].fullyQualifiedName,
          },
          requirementDescription: requirement.descriptions[0],
        };
      }) as any,
    };
  }

  public async deleteTraceLink(
    ownerId: string,
    matrixId: string,
    traceLink: ITraceLink
  ): Promise<void> {
    const { _id } = traceLink;

    const matrix: ITraceLinkMatrix | null = await this.findById(matrixId);

    if (!matrix) throw new Error("No Matrix Found");
    if (matrix.relatedRepoOwnerId && matrix.relatedRepoOwnerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");

    const traceLinkExist: boolean = (matrix.links || []).some((link) => {
      return link._id.toString() === _id.toString();
    });

    if (!traceLinkExist) throw new Error("No Related Trace Link Found");

    const found: ITraceLink | null = await this.ctx.model.TraceLink.findOneAndDelete(
      { _id }
    );

    if (!found) return;

    await this.getModel().findOneAndUpdate(
      { _id: matrix._id },
      { $pullAll: { links: [found._id] } }
    );
  }
}
