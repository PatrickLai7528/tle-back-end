import { extractToken } from "./../utils/Token";
import { Controller } from "egg";
import { OK } from "http-status-codes";
import { ITraceLink, ITraceLinkMatrix } from "./../entity/types";
import { ITraceLinkHistory } from "../entity/ServerOnly";

export default class TraceLinkController extends Controller {
  public async initRepoTraceLink() {
    const { ctx } = this;
    const requirememt = ctx.request.body.requirement;
    const files = ctx.request.body.files;
    const { githubId } = extractToken(ctx, this.config);

    const matrix = await ctx.service.traceLink.init(
      files,
      requirememt,
      githubId
    );

    ctx.body = { success: true, payload: matrix };
    ctx.status = OK;
  }

  public async query() {
    const { ctx } = this;
    const { repoName, file, descriptionId } = ctx.query;
    const { githubId } = extractToken(ctx, this.config);
    let found: ITraceLink[] = [];
    if (file) {
      found = await ctx.service.traceLink.findByFileAndRepoName(
        githubId,
        repoName,
        file
      );
    } else if (descriptionId) {
      found = await ctx.service.traceLink.findByDescriptionIdAndRepoName(
        githubId,
        repoName,
        descriptionId
      );
    }

    ctx.body = { success: true, payload: found };
  }

  public async getRepoTraceLinkMatrix() {
    const { repoName } = this.ctx.query;
    const { githubId } = extractToken(this.ctx, this.config);

    const matrix: ITraceLinkMatrix = await this.service.traceLink.findByRepoName(
      githubId,
      repoName
    );
    this.ctx.body = { success: true, payload: matrix };
  }

  public async queryHistory() {
    const { ctx } = this;
    const { commitSha, repoName } = ctx.query;
    const { githubId } = extractToken(ctx, this.config);
    const history:
      | ITraceLinkHistory
      | undefined = await ctx.service.traceLink.findHistoryByCommitAndRepoName(
      githubId,
      repoName,
      commitSha
    );

    ctx.body = { success: true, payload: history };
  }

  public async create() {
    const { ctx } = this;
    const traceLinkMatrix = ctx.request.body;
    const { githubId } = extractToken(ctx, this.config);
    await ctx.service.traceLink.create({
      ...traceLinkMatrix,
      relatedRepoOwnerId: githubId,
    });

    ctx.body = { success: true };
    ctx.status = OK;
  }

  public async addTraceLink() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { repoName, newTraceLink } = this.ctx.request.body;

    const traceLinkWithId = await this.ctx.service.traceLink.addTraceLink(
      githubId,
      repoName,
      newTraceLink
    );
    this.ctx.body = { success: true, payload: traceLinkWithId };
  }

  public async deleteTraceLink() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { matrixId, traceLink } = this.ctx.request.body;

    await this.ctx.service.traceLink.deleteTraceLink(
      githubId,
      matrixId,
      traceLink
    );

    this.ctx.body = { success: true };
  }
}
