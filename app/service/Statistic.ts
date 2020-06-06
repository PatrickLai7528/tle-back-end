import {
  IFileTreeNode,
  IImportedRepository,
  ITraceLink,
  IStatistic,
  IRequirementDescription,
} from "./../entity/types";
import { Service } from "egg";

type GraphNode = { id: string | number; name: string; value: number };
type GraphLink = {
  source: string | number;
  target: string | number;
  sourceWeight: number;
  targetWeight: number;
};

type GraphData = { links: GraphLink[]; nodes: GraphNode[] };

export default class Statistic extends Service {
  private async findAndCheckRepo(
    ownerId: string,
    repoId: string
  ): Promise<IImportedRepository> {
    const repository: IImportedRepository | null = await this.service.repository.findById(
      repoId
    );

    if (!repository) throw new Error("No Repository Found");
    if (repository.ownerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");

    return repository;
  }

  public async getTraceLinkStatistic(
    ownerId: string,
    repoId: string
  ): Promise<GraphData> {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );

    // const descriptions: IRequirementDescription[] =
    //   (
    //     (await this.ctx.service.requirement.findByRepoName(
    //       ownerId,
    //       repository.name
    //     )) || {}
    //   ).descriptions || [];

    const fileNodes = repository.trees;
    console.log(fileNodes);
    const traceLinks: ITraceLink[] =
      (
        await this.ctx.service.traceLink.findByRepoName(
          ownerId,
          repository.name
        )
      )?.links || [];

    // const implementNodes: GraphNode[] = [];
    // const descriptionNodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodes: GraphNode[] = [];
    for (const traceLink of traceLinks) {
      nodes.push({
        id: traceLink.implement._id.toString(),
        name: traceLink.implement.fullyQualifiedName,
        value: 30,
      });
      nodes.push({
        id: traceLink.requirementDescription._id.toString(),
        name: traceLink.requirementDescription.name,
        value: 30,
      });
      links.push({
        source: traceLink.implement.fullyQualifiedName,
        target: traceLink.requirementDescription._id.toString(),
        targetWeight: 20,
        sourceWeight: 20,
      });
    }
    // const flattenTrees = flatten(fileNodes.map(node => (node as any).toObject()));
    // for (const file of flattenTrees) {
    //   implementNodes.push({
    //     id: file.fullyQualifiedName,
    //     name: file.fullyQualifiedName,
    //     value: 20,
    //   });
    // }
    // for (const description of descriptions) {
    //   descriptionNodes.push({
    //     id: description._id,
    //     name: description.name,
    //     value: 30,
    //   });
    // }
    return { links, nodes };
  }

  public async getRequirementChangesStatistic(
    ownerId: string,
    repoId: string
  ): Promise<IStatistic[]> {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );

    const descriptions: IRequirementDescription[] =
      (
        (await this.ctx.service.requirement.findByRepoName(
          ownerId,
          repository.name
        )) || {}
      ).descriptions || [];

    return descriptions.map((desc) => ({
      label: desc.name,
      value: Math.round(Math.random() * 10),
    }));
  }

  public async getRequirementStatistic(ownerId: string, repoId: string) {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );

    const descriptions: IRequirementDescription[] =
      (
        (await this.ctx.service.requirement.findByRepoName(
          ownerId,
          repository.name
        )) || {}
      ).descriptions || [];

    const traceLinks: ITraceLink[] = await this.ctx.service.traceLink.getTraceLinkByRepoName(
      ownerId,
      repository.name
    );

    const statistics: {
      description: IRequirementDescription;
      value: number;
    }[] = descriptions.map((description) => ({ description, value: 0 }));

    for (const link of traceLinks) {
      for (const item of statistics) {
        if (
          link.requirementDescription._id.toString() ===
          item.description._id.toString()
        ) {
          item.value++;
        }
      }
    }

    return statistics.map((item) => ({
      label: item.description.name,
      value: item.value,
    }));
  }

  public async getFileStatistic(
    ownerId: string,
    repoId: string
  ): Promise<IStatistic[]> {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );

    const filenames: string[] = [];

    const traverse = (node: IFileTreeNode) => {
      if (node.type === "FILE") {
        filenames.push(node.fullyQualifiedName);
      } else if (node.type === "FOLDER") {
        (node.subTrees || []).map(traverse);
      }
    };

    const trees = repository.trees || [];
    trees.map(traverse);

    // get trace link
    const traceLinks: ITraceLink[] = await this.service.traceLink.getTraceLinkByRepoName(
      ownerId,
      repository.name
    );

    const statistics: IStatistic[] = filenames.map((name) => ({
      label: name,
      value: 0,
    }));

    traceLinks.map((link) => {
      const {
        implement: { fullyQualifiedName },
      } = link;
      for (const item of statistics) {
        if (item.label.toString() === fullyQualifiedName.toString()) {
          item.value++;
        }
      }
    });

    return statistics;
  }
}
