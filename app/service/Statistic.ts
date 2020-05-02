import {
  IFileTreeNode,
  IImportedRepository,
  ITraceLink,
} from "./../entity/types";
import { Service } from "egg";
import { IStatistic } from "../entity/ServerOnly";

export default class Statistic extends Service {
  public async getFileStatistic(
    ownerId: string,
    repoId: string
  ): Promise<IStatistic[]> {
    const repository: IImportedRepository | null = await this.service.repository.findById(
      repoId
    );

    if (!repository) throw new Error("No Repository Found");
    if (repository.ownerId !== ownerId)
      throw new Error("This Only Allow Operated By Owner");

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
