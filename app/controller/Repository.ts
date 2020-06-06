import { Controller } from "egg";
import { OK } from "http-status-codes";

import { extractToken } from "../utils/Token";
import { IImportedRepository, IRecentRepo } from "./../entity/types";

// type FinishImportBody = {
//   repo: Omit<IImportedRepository, "_id">,
//   requirement: Omit<IRequirement, "_id">,
//   matrix: Omit<ITraceLinkMatrix, "_id">
// }

export default class RepositorController extends Controller {
  // public async finishImport() {
  //   const { githubId } = extractToken(this.ctx, this.config);

  //   const { repo, requirement, matrix }: FinishImportBody = this.ctx.body;

  //   await this.ctx.service.repository.create(repo);
  //   const requirementId = await this.ctx.service.requirement.create(requirement);
  //   const savedRequirement = await this.ctx.service.requirement.findById(requirementId);

  //   if (!savedRequirement) throw new Error();

  //   const nameToId = {};
  //   for (const description of (savedRequirement.descriptions || [])) {
  //     nameToId[description.name] = description._id;
  //   }

  //   const linksWithDescriptionId = (matrix.links || []).map(link => {
  //     return {
  //       ...link,
  //       requirementDescription: {
  //         ...link.requirementDescription,
  //         _id: nameToId[link.requirementDescription.name],
  //       }
  //     }
  //   })

  //   await this.ctx.service.traceLink.create({ ...matrix, links: linksWithDescriptionId });
  //   this.ctx.body = { success: true };
  //   this.ctx.status = OK;
  // }

  public async delete() {
    const { githubId } = extractToken(this.ctx, this.config);
    const { id } = this.ctx.params;

    await this.ctx.service.repository.delete(githubId, id);

    this.ctx.body = { success: true };
    this.ctx.status = OK;
  }

  public async index() {
    const { ctx } = this;
    const { githubId } = extractToken(ctx, this.config);
    const repositoris: IImportedRepository[] = await ctx.service.repository.findByOwnerId(
      githubId
    );
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
    const repository: IImportedRepository = await ctx.service.repository.findById(
      id
    );

    ctx.body = { success: true, payload: repository };
    ctx.status = OK;
  }

  public async getRecentRepo() {
    const { ctx } = this;
    const limit = ctx.query.limit || 6;
    const { githubId } = extractToken(ctx, this.config);
    let repoRepos: IRecentRepo[] = await ctx.service.repository.findRepoSortedUpdate(
      githubId
    );

    if (repoRepos.length > limit) {
      repoRepos = repoRepos.slice(0, limit);
    }
    ctx.body = { success: true, payload: repoRepos };
  }

  public async isRepoImported() {
    const { ctx } = this;
    const { githubId } = extractToken(ctx, this.config);
    const { repoName } = ctx.query;
    const importedRepositoris: IImportedRepository[] = await ctx.service.repository.find(
      { ownerId: githubId, name: repoName }
    );

    const imported = importedRepositoris && importedRepositoris.length > 0;

    ctx.body = { success: true, payload: imported };
  }

  public async getAllFilenames() {
    const { ctx } = this;
    const { githubId } = extractToken(ctx, this.config);
    const { repoId } = ctx.params;

    const filenames: string[] = await ctx.service.repository.getAllFilenames(
      githubId,
      repoId
    );

    ctx.body = { success: true, payload: filenames };
  }
}
