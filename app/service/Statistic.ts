import {
  IFileTreeNode,
  IImportedRepository,
  ITraceLink,
  IStatistic,
  IRequirementDescription,
  ICommit,
} from "./../entity/types";
import { Service } from "egg";
import { ITraceLinkHistory } from "../entity/ServerOnly";

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

  public async getCommitStatistic(
    ownerId: string,
    repoId: string
  ): Promise<IStatistic[]> {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );
    const commits: ICommit[] = (repository.commits || []).sort(
      (a, b) => a.committedAt - b.committedAt
    );

    const statistics: IStatistic[] = [];

    for (const commit of commits) {
      const history:
        | ITraceLinkHistory
        | undefined = await this.ctx.service.traceLink.findHistoryByCommitAndRepoName(
        ownerId,
        repository.name,
        commit.sha
      );
      if (history)
        statistics.push({
          label: commit.message,
          value: [
            commit.stats.total,
            history.removed.traceLinks.length + history.added.traceLinks.length,
          ],
        });
    }

    return statistics;
  }

  public async getRequirementStatistic(ownerId: string, repoId: string) {
    const repository: IImportedRepository = await this.findAndCheckRepo(
      ownerId,
      repoId
    );

    const descriptions: IRequirementDescription[] = (
      await this.ctx.service.requirement.findByRepoName(
        ownerId,
        repository.name
      )
    ).descriptions;

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
          (item.value as number)++;
        }
      }
    });

    return statistics;
  }
}
