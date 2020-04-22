import { extractToken } from './../utils/Token';
import { Controller } from "egg";
import { OK } from 'http-status-codes';
import { ITraceLink, ITraceLinkHistory } from './../entity/types';

export default class TraceLinkController extends Controller {

   public async initRepoTraceLink() {
      const { ctx } = this;
      const requirememt = ctx.request.body.requirement;
      const files = ctx.request.body.files;

      const matrix = await ctx.service.traceLink.init(files, requirememt);

      ctx.body = { success: true, payload: matrix }
      ctx.status = OK
   }

   public async query() {
      const { ctx } = this;
      const { repoName, file } = ctx.query;
      const { githubId } = extractToken(ctx, this.config);
      let found: ITraceLink[] = [];
      if (file) {
         found = await ctx.service.traceLink.findByFileAndRepoName(githubId, repoName, file);
      }

      ctx.body = { success: true, payload: found };
   }

   public async queryHistory() {
      const { ctx } = this;
      const { commitSha, repoName } = ctx.query;
      const { githubId } = extractToken(ctx, this.config);
      const history: ITraceLinkHistory | undefined = await ctx.service.traceLink.findByCommitAndRepoName(githubId, repoName, commitSha);

      ctx.body = { success: true, payload: history };
   }

   public async create() {
      const { ctx } = this;
      const traceLinkMatrix = ctx.request.body;
      const { githubId } = extractToken(ctx, this.config);
      await ctx.service.traceLink.create({ ...traceLinkMatrix, relatedRepoOwnerId: githubId });

      ctx.body = { success: true };
      ctx.status = OK;
   }

}