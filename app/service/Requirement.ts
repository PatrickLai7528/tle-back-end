import { Service } from "egg";
import {
  IRequirement,
  IRequirementDescription,
  IDescriptionHistory,
} from "./../entity/types";

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

    const newDescriptions: IRequirementDescription[] = [];
    for (const description of requirement.descriptions) {
      if (description._id.toString() !== descriptionId) {
        newDescriptions.push({ ...description });
      }
    }

    const newRequirement: IRequirement = {
      ...requirement,
      descriptions: newDescriptions,
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

  private async addDescriptionHistory(
    ownerId: string,
    requirementId: string,
    old: IRequirementDescription,
    newer: Partial<IRequirementDescription>
  ): Promise<void> {
    const history: Omit<IDescriptionHistory, "_id"> = {
      ownerId,
      requirementId,
      oldDescription: old,
      newDescription: newer,
      createAt: Date.now(),
      lastUpdateAt: Date.now(),
    };

    await this.getCRUD().create(history, this.ctx.model.DescriptionHistory);
  }

  public async updateDescription(
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

    const newDescriptions: IRequirementDescription[] = [];
    let old: IRequirementDescription | null = null;
    let changeFieldAndValue: Partial<IRequirementDescription> = {};

    type DescriptionKeys = keyof IRequirementDescription;
    const ingoreKeys: DescriptionKeys[] = ["_id"];
    const ignore = (key: any) => {
      return ingoreKeys.indexOf(key) !== -1;
    };

    for (const oldDescription of requirement.descriptions || []) {
      if (description._id.toString() === oldDescription._id.toString()) {
        newDescriptions.push({ ...oldDescription, ...description });
        old = { ...oldDescription };
        for (const key of Object.keys(oldDescription)) {
          if (
            !ignore(key) &&
            description[key] &&
            oldDescription[key] !== description[key]
          ) {
            changeFieldAndValue = { [key]: description[key] };
          }
        }
      } else {
        newDescriptions.push(oldDescription);
      }
    }

    if (!old) throw new Error("No Requirement Description Found");

    const newRequirement: IRequirement = {
      ...requirement,
      descriptions: newDescriptions,
    };

    await this.getCRUD().update(requirement, newRequirement, this.getModel());

    await this.addDescriptionHistory(
      ownerId,
      requirementId,
      old,
      changeFieldAndValue
    );

    return (await this.findById(requirementId)) as IRequirement;
  }
}
