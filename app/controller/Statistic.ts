import { extractToken } from "../utils/Token";
import { Controller } from "egg";
import { IStatistic } from "../entity/types";

export default class Statistic extends Controller {
  public async getTraceLinkGraph() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoId } = this.ctx.query;

    const graphData: any = await this.service.statistic.getTraceLinkStatistic(
      githubId,
      repoId
    );

    this.ctx.body = { success: true, payload: graphData };
  }

  public async getRequirementChangesStatistic() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoId } = this.ctx.query;

    const statistics: IStatistic[] = await this.service.statistic.getRequirementChangesStatistic(
      githubId,
      repoId
    );

    this.ctx.body = { success: true, payload: statistics };
  }

  public async getFileStatistic() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoId } = this.ctx.query;

    const statistics: IStatistic[] = await this.service.statistic.getFileStatistic(
      githubId,
      repoId
    );

    this.ctx.body = { success: true, payload: statistics };
  }

  public async getRequirementStatistic() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoId } = this.ctx.query;

    const statistics: IStatistic[] = await this.service.statistic.getRequirementStatistic(
      githubId,
      repoId
    );

    this.ctx.body = { success: true, payload: statistics };
  }
}
