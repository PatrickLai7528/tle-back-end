import { Service } from 'egg';
import { IRequirement } from './../entity/types';

export default class RequirementService extends Service {

   private getCRUD() {
      return this.ctx.service.cRUD;
   }

   private getModel() {
      return this.ctx.model.Requirement;
   }

   public async create(requirement: IRequirement): Promise<void> {
      await this.getCRUD().create(requirement, this.getModel());
   }

   public async find(requirement: Partial<IRequirement>): Promise<IRequirement[]> {
      const res = await this.getCRUD().read({ ...requirement }, this.getModel()) as IRequirement[];
      return res;
   }

   public async findByRepoName(ownerId: string, repoName: string): Promise<IRequirement> {
      return (await this.find({ relatedRepoOwnerId: ownerId, relatedRepoName: repoName }))[0];
   }

}