import { IRequirement } from "../entity/types";
import { requirementDescriptionMocks } from "./RequirementDescription";

const fromIndex = Math.round(
  Math.random() * requirementDescriptionMocks.length
);

export const requirementMock: IRequirement = {
  _id: "jkladjf",
  relatedRepo: "RELATED REPO NAME",
  relatedRepoOwnerId: "RELATED REPO OWNER ID",
  descriptions: requirementDescriptionMocks.slice(fromIndex, fromIndex + 10),
};
