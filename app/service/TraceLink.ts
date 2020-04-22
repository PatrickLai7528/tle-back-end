import { Service } from "egg";
import { flatten } from '../utils/Tree';
import { IFileTreeNode, IRequirement, ITraceLink, ITraceLinkHistory, ITraceLinkMatrix } from './../entity/types';
import { traceLinkMocks } from "./../mock/TraceLinks";
import { v4 as uuidv4 } from "uuid";

export default class TraceLinkService extends Service {

   private getCRUD() {
      return this.ctx.service.cRUD;
   }

   private getModel() {
      return this.ctx.model.TraceLinkMatrix;
   }

   public async create(matrix: ITraceLinkMatrix): Promise<void> {
      await this.getCRUD().create(matrix, this.getModel());
   }

   public async find(matrix: Partial<ITraceLinkMatrix>): Promise<ITraceLinkMatrix[]> {
      return await this.getCRUD().read({ ...matrix }, this.getModel()) as ITraceLinkMatrix[]
   }

   public async findByCommitAndRepoName(ownerId: string, repoName: string, commitSha: string): Promise<ITraceLinkHistory | undefined> {
      // const histories: ITraceLinkHistory[] = await this.ctx.model.TraceLinkHistory.find({ ownerId, repoName });
      // return histories.filter(history => history.commit.sha === commitSha)[0];
      const commit = await this.ctx.service.repository.findCommitBySha(ownerId, repoName, commitSha);

      if (!commit) return undefined;

      return {
         _id: uuidv4(),
         commit,
         added: { traceLinks: traceLinkMocks.slice(1, 3) },
         removed: { traceLinks: traceLinkMocks.slice(4, 6) }
      }
   }

   public async findByRequirementIdAndRepoName(ownerId: string, repoName: string, requirementId: string): Promise<ITraceLink[]> {
      const matrix: ITraceLinkMatrix = (await this.find({ relatedRepoName: repoName, relatedRepoOwnerId: ownerId }))[0];

      if (!matrix) return [];
      console.log(requirementId);
      const traceLinks: ITraceLink[] = matrix.links || [];
      return traceLinks;
   }

   /**
    * 
    * @param ownerId: github id 
    * @param repoName: imported repo name
    * @param filename: fully quialified file name
    */
   public async findByFileAndRepoName(ownerId: string, repoName: string, filename: string): Promise<ITraceLink[]> {
      const matrix: ITraceLinkMatrix = (await this.find({ relatedRepoName: repoName, relatedRepoOwnerId: ownerId }))[0];

      if (!matrix) return [];

      const traceLinks: ITraceLink[] = matrix.links || [];

      const relatedLinks: ITraceLink[] = traceLinks.filter(link => {
         if (link.implement) {
            return link.implement.fullyQualifiedName === filename
         } else return false;
      });

      console.log(relatedLinks);
      return relatedLinks;
   }

   public async init(files: IFileTreeNode[], requirement: IRequirement): Promise<ITraceLinkMatrix> {
      const flattenFileTrees = flatten(files).filter(file => file.type === "FILE");
      return {
         relatedRepoName: "TEMP NAME",
         links: traceLinkMocks.slice(1, 10).map(link => {
            return {
               ...link,
               implement: {
                  ...link.implement,
                  fullyQualifiedName: flattenFileTrees[Math.round(Math.random() * (flattenFileTrees.length - 1))].fullyQuilaifiedName
               },
               requirementDescription: requirement.descriptions[0]
            }
         })
      }
   }

}