/**
 * 
 *  _id: string;
  // 倉庫名稱
  name: string;

  ownerId: string;

  currentBranch: string;

  branches: IBranch[];

  trees: IFileTreeNode[];

  commits: ICommit[];

  language: ProgramLanguage;

  description: string;

  lastUpdateAt?: number;

  shaFileContentMap: ShaFileContentMap;
 */

import { IImportedRepository } from "../entity/types";

export const importedRepositoryMocks: IImportedRepository[] = [
  {
    _id: "jalksdjfklasd",
    name: "imported repository name 1",
    description: "kajlksdjfklasdjflk",
    ownerId: "ownerid",
    currentBranch: "master",
    branches: [],
    trees: [],
    commits: [],
    language: "Java",
    shaFileContentMap: {},
  },
];
