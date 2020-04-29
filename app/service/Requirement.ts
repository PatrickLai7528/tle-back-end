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

  public async saveDescriptions(
    descriptions: Omit<IRequirementDescription, "_id">[]
  ): Promise<string[]> {
    return await Promise.all(descriptions.map(this.saveDescription.bind(this)));
  }

  public async saveDescription(
    description: Omit<IRequirementDescription, "_id">
  ): Promise<string> {
    const { ctx } = this;
    return new Promise<string>((resolve, reject) => {
      const { _id, ...others } = description as any;
      ctx.model.RequirementDescription.create(
        others,
        (err: any, saved: IRequirementDescription) => {
          if (err) reject(err);
          else resolve(saved._id);
        }
      );
    });
  }

  public async create(requirement: Omit<IRequirement, "_id">): Promise<string> {
    const { descriptions, _id, ...others } = requirement as any;

    const descriptionIds: string[] = await this.saveDescriptions(descriptions);

    return this.getCRUD().create(
      { ...others, descriptions: descriptionIds },
      this.getModel()
    );
  }

  public async find(
    requirement: Partial<IRequirement>
  ): Promise<IRequirement[]> {
    const res: IRequirement[] = (
      await this.getModel().find(requirement).populate("descriptions")
    ).map((item) => item.toObject());
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
    description: Omit<IRequirementDescription, "_id">
  ): Promise<IRequirement> {
    const requirement: IRequirement | null = await this.findById(requirementId);
    if (!requirement) throw new Error("No Requirement Found");

    if (
      !requirement.relatedRepoOwnerId ||
      requirement.relatedRepoOwnerId !== ownerId
    )
      throw new Error("This Only Allow Operated By Owner");

    const descriptionId = await this.saveDescription(description);

    await this.getModel().update(
      { _id: requirement._id },
      { $push: { descriptions: descriptionId } }
    );

    return (await this.findById(requirementId)) as IRequirement;
  }

  private async addDescriptionHistory(
    ownerId: string,
    requirementId: string,
    descriptionId: string,
    old: Partial<IRequirementDescription>,
    newer: Partial<IRequirementDescription>
  ): Promise<void> {
    const history: Omit<IDescriptionHistory, "_id"> = {
      ownerId,
      requirementId,
      descriptionId: descriptionId,
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

    const oldDescription: IRequirementDescription | null = await this.ctx.model.RequirementDescription.findById(
      description._id
    );
    if (!oldDescription) throw new Error("No Description Found");

    let oldFieldAndValue: Partial<IRequirementDescription> = {};
    let changeFieldAndValue: Partial<IRequirementDescription> = {};

    type DescriptionKeys = keyof IRequirementDescription;
    const ingoreKeys: DescriptionKeys[] = [
      "_id",
      "lastUpdateAt",
      "createAt",
      "createBy",
      "lastUpdateBy",
    ];
    const ignore = (key: any) => {
      return ingoreKeys.indexOf(key) !== -1;
    };
    if (description._id.toString() === oldDescription._id.toString()) {
      for (const key of Object.keys(oldDescription)) {
        if (
          !ignore(key) &&
          description[key] &&
          oldDescription[key] !== description[key]
        ) {
          changeFieldAndValue = { [key]: description[key] };
          oldFieldAndValue = { [key]: oldDescription[key] };
        }
      }
    }

    const { _id, ...others } = description;
    await this.ctx.model.RequirementDescription.update(
      { _id: description._id },
      others
    );

    await this.addDescriptionHistory(
      ownerId,
      requirementId,
      description._id,
      oldFieldAndValue,
      changeFieldAndValue
    );

    return (await this.findById(requirementId)) as IRequirement;
  }

  public async getDescriptionHistory(
    ownerId: string,
    requirementId: string,
    descriptionId: string
  ): Promise<IDescriptionHistory[]> {
    const history: IDescriptionHistory[] = (await this.getCRUD().read(
      { requirementId, descriptionId, ownerId },
      this.ctx.model.DescriptionHistory
    )) as IDescriptionHistory[];
    return history;
  }
}
