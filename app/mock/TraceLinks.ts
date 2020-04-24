import { implementMocks } from "./Implements";
import { ITraceLink } from '../entity/types';
import { requirementDescriptionMocks } from './RequirementDescription';

const randomIndex = () => {
   return Math.round(Math.random() * implementMocks.length);
};

export const traceLinkMocks: ITraceLink[] = [
   {
      id: "b2d82fd0-c868-4330-a505-4dd82724a248",
      lastUpdateAt: 1529235576657,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "b30807a2-2375-496a-9b9a-5b6dc51edf7c",
      lastUpdateAt: 1293107590371,
      requirementDescription: requirementDescriptionMocks[1],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "56e80296-dc68-4968-bdc9-7cadc37d4626",
      lastUpdateAt: 1325039634918,
      requirementDescription: requirementDescriptionMocks[2],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "fe1c839a-9f9d-4962-a6f6-a7a5bbe0dfea",
      lastUpdateAt: 1533351397243,
      requirementDescription: requirementDescriptionMocks[3],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "20de38b5-6a6b-4873-a7cd-ac7b5f8690d5",
      lastUpdateAt: 1335565400353,
      requirementDescription: requirementDescriptionMocks[3],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "e18c0c39-dcef-4738-b6b9-5b21374c5a6b",
      lastUpdateAt: 1435932435759,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "cea54509-4cc5-4766-9eda-acd558525dfe",
      lastUpdateAt: 1407741220426,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "cac80479-dd08-4cc2-9775-b7a7123912b4",
      lastUpdateAt: 1374381590820,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "68c54560-7daa-4d34-922b-dd979cbf7359",
      lastUpdateAt: 1539429540690,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "14d59414-fd3f-4898-a9f8-f8d8c9a49333",
      lastUpdateAt: 1330400391822,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   },
   {
      id: "cb1ea888-d359-43d9-b75c-6a789d86fea8",
      lastUpdateAt: 1418491467710,
      requirementDescription: requirementDescriptionMocks[0],
      implement: implementMocks[randomIndex()]
   }
];
