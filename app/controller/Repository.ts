import { IImportedRepository, IRecentRepo } from './../entity/types';
import { OK } from 'http-status-codes';
import { Controller } from 'egg';
import { extractToken } from '../utils/Token';

export default class RepositorController extends Controller {

   public async index() {
      const { ctx } = this;
      const { githubId } = extractToken(ctx, this.config);
      const repositoris: IImportedRepository[] = await ctx.service.repository.findByOwnerId(githubId);
      ctx.body = { success: true, payload: repositoris };
      ctx.status = OK;
   }

   public async create() {
      const { ctx } = this;
      const repository: IImportedRepository = ctx.request.body;
      await ctx.service.repository.create(repository);
      ctx.body = { success: true };
      ctx.status = OK;
   }

   public async show() {
      const { ctx } = this;
      const { id } = ctx.params;
      const repository: IImportedRepository = await ctx.service.repository.findById(id);

      ctx.body = { success: true, payload: repository };
      ctx.status = OK;
   }

   public async getRecentRepo() {
      const { ctx } = this;
      const limit = ctx.query.limit || 6;
      const { githubId } = extractToken(ctx, this.config);
      let repoRepos: IRecentRepo[] = await ctx.service.repository.findRepoSortedUpdate(githubId);


      if (repoRepos.length > limit) {
         repoRepos = repoRepos.slice(0, limit);
      }
      ctx.body = { success: true, payload: repoRepos }
   }

   public async isRepoImported() {
      const { ctx } = this;
      const { githubId } = extractToken(ctx, this.config);
      const { repoName } = ctx.query;
      const importedRepositoris: IImportedRepository[] = await ctx.service.repository.find({ ownerId: githubId, name: repoName });

      const imported = importedRepositoris && importedRepositoris.length > 0;

      ctx.body = { success: true, payload: imported };
   }
}