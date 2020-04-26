import { Service } from "egg";
import { IRequirement, IRequirementDescription } from "./../entity/types";

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

  public async find(
    requirement: Partial<IRequirement>
  ): Promise<IRequirement[]> {
    const res = (await this.getCRUD().read(
      { ...requirement },
      this.getModel()
    )) as IRequirement[];
    return res;
  }

  public async findById(id: string): Promise<IRequirement | null> {
    const res = (await this.find({ _id: id }))[0];
    return res;
  }

  public async findByRepoName(
    ownerId: string,
    repoName: string
  ): Promise<IRequirement> {
    return (
      await this.find({
        relatedRepoOwnerId: ownerId,
        relatedRepoName: repoName,
      })
    )[0];
  }

  public async delete(ownerId: string, requirementId: string): Promise<void> {
    const requirement: IRequirement | null = await this.findById(requirementId);
    if (!requirement) throw new Error("No Requirement Found");

    if (
      !requirement.relatedRepoOwnerId ||
      requirement.relatedRepoOwnerId !== ownerId
    )
      throw new Error("This Only Allow Operated By Owner");

    await this.getCRUD().delete(requirement, this.getModel());
  }

  public async deleteDescription(
    ownerId: string,
    requirementId,
    descriptionId: string
  ): Promise<IRequirement> {
    const requirement: IRequirement | null = await this.findById(requirementId);

    if (!requirement) throw new Error("No Requirement Found");

    if (
      !requirement.relatedRepoOwnerId ||
      requirement.relatedRepoOwnerId !== ownerId
    )
      throw new Error("This Only Allow Operated By Owner");

    // await this.getCRUD().delete(requirement, this.getModel());
    const newRequirement: IRequirement = {
      ...requirement,
      descriptions: requirement.descriptions.filter(
        ({ _id }) => _id === descriptionId
      ),
    };

    await this.getCRUD().update(requirement, newRequirement, this.getModel());
    return newRequirement;
  }

  public async addDescription(
    ownerId: string,
    requirementId: string,
    description: IRequirementDescription
  ): Promise<IRequirement> {
    const requirement: IRequirement | null = await this.findById(requirementId);
    if (!requirement) throw new Error("No Requirement Found");

    if (
      !requirement.relatedRepoOwnerId ||
      requirement.relatedRepoOwnerId !== ownerId
    )
      throw new Error("This Only Allow Operated By Owner");

    const newRequirement: IRequirement = {
      ...requirement,
      descriptions: [...requirement.descriptions, description],
    };

    await this.getCRUD().update(requirement, newRequirement, this.getModel());
    return newRequirement;
  }
}
