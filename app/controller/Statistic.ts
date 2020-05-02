import { IStatistic } from "../entity/ServerOnly";
import { extractToken } from "../utils/Token";
import { Controller } from "egg";

export default class Statistic extends Controller {
  public async getFileStatistic() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoId } = this.ctx.query;

    const statistics: IStatistic[] = await this.service.statistic.getFileStatistic(
      githubId,
      repoId
    );

    this.ctx.body = { success: true, payload: statistics };
  }
}
