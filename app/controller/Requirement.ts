import { IRequirement } from './../entity/types';
import { OK } from 'http-status-codes';
import { Controller } from 'egg';
import { extractToken } from '../utils/Token';

export default class RequirementController extends Controller {

   public async create() {
      const { ctx } = this;
      const requirement = ctx.request.body;
      const { githubId } = extractToken(ctx, this.config);
      await ctx.service.requirement.create({ ...requirement, relatedRepoOwnerId: githubId });

      ctx.body = { success: true };
      ctx.status = OK
   }


   public async query() {
      const { ctx } = this;
      const { repoName } = ctx.query;
      const { githubId } = extractToken(ctx, this.config);
      const res: IRequirement = await ctx.service.requirement.findByRepoName(githubId, repoName);
      ctx.body = { success: true, payload: res };
   }

   public async delete() {
      const { id } = this.ctx.params;
      const { githubId } = extractToken(this.ctx, this.config);
      await this.ctx.service.requirement.delete(githubId, id);
      this.ctx.body = { success: true }
   }

   public async deleteDescription() {
      const { requirementId, descriptionId } = this.ctx.params;
      const { githubId } = extractToken(this.ctx, this.config);

      const newRequirement: IRequirement = await this.ctx.service.requirement.deleteDescription(githubId, requirementId, descriptionId);

      this.ctx.body = { success: true, payload: newRequirement };
   }
}