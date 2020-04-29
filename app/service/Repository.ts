import {
  IImportedRepository,
  IRecentRepo,
  ICommit,
  IFileTreeNode,
} from "./../entity/types";
import { Service } from "egg";
import CRUD from "./CRUD";

export default class RepositoryService extends Service {
  private getCRUD(): CRUD {
    return this.ctx.service.cRUD;
  }

  private getModel() {
    return this.ctx.model.Repository;
  }

  public async findCommitBySha(
    ownerId: string,
    repoName: string,
    commitSha: string
  ): Promise<ICommit | undefined> {
    const repo: IImportedRepository = (
      await this.find({ ownerId: ownerId, name: repoName })
    )[0];

    if (!repo) return undefined;

    const commits: ICommit[] = repo.commits || [];

    return commits.filter((commit) => {
      return commit.sha === commitSha;
    })[0];
  }

  public async find(
    t: Partial<IImportedRepository>
  ): Promise<IImportedRepository[]> {
    return (await this.getCRUD().read(
      t,
      this.getModel()
    )) as IImportedRepository[];
  }

  public async create(repo: IImportedRepository): Promise<void> {
    try {
      await this.getCRUD().create(repo, this.getModel());
    } catch (e) {
      throw e;
    }
  }

  public async findAll(): Promise<IImportedRepository[]> {
    try {
      return await this.ctx.model.Repository.find();
    } catch (e) {
      throw e;
    }
  }

  public async findById(id: string): Promise<IImportedRepository> {
    try {
      const res = (await this.getModel().find({ _id: id }))[0];
      return res;
    } catch (e) {
      throw e;
    }
  }

  public async findRepoSortedUpdate(ownerId: string): Promise<IRecentRepo[]> {
    const repos: IImportedRepository[] = await this.getModel()
      .find({ ownerId })
      .sort("lastUpdateAt");
    return (repos || []).map((repo) => {
      return {
        name: repo.name,
        _id: repo._id.toString(),
        language: repo.language,
        lastUpdateAt: repo.lastUpdateAt || Date.now(),
        lastUpdateBy: repo.commits[0].author?.id || "unknown",
        description: repo.description,
      };
    });
  }

  public async findByOwnerId(ownerId: string): Promise<IImportedRepository[]> {
    const repos: IImportedRepository[] = (await this.getModel().find({
      ownerId,
    })) as IImportedRepository[];
    return repos;
  }

  public async getAllFilenames(
    ownerId: string,
    repoId: string
  ): Promise<string[]> {
    const repo: IImportedRepository = await this.findById(repoId);

    if (!repo) throw new Error("No Repository Found");
    if (!repo.ownerId || repo.ownerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");
    const { trees } = repo;

    const filenames: string[] = [];

    const traverse = (node: IFileTreeNode) => {
      if (node.type === "FILE") {
        filenames.push(node.fullyQualifiedName);
      } else if (node.type === "FOLDER") {
        (node.subTrees || []).map(traverse);
      }
    };

    trees.map(traverse);

    return filenames;
  }
}
