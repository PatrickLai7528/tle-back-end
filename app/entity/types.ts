import { ProgramLanguage } from "./ServerOnly";

export interface IDescriptionHistory {
  _id: string;
  ownerId: string;
  requirementId: string;
  descriptionId: string;
  oldDescription: Partial<IRequirementDescription>;
  newDescription: Partial<IRequirementDescription>;
  createAt: number;
  lastUpdateAt: number;
}
export interface IUserActivity {
  _id: string;
  avatarUrl: string;
  title: string;
  description: string;
}

export interface IImplement {
  id: string;
  type: "METHOD" | "CLASS";
  fullyQualifiedName: string;
  traced?: boolean;
}

export interface ITraceLink {
  _id: string;
  requirementDescription: IRequirementDescription;
  implement: IImplement;
  lastUpdateAt?: number;
}

export interface ITraceLinkMatrix {
  _id: string;
  links: ITraceLink[];
  relatedRepoOwnerId?: string;
  relatedRepoName: string;
}

export interface IRequirementDescription {
  traced?: boolean;
  lastUpdateAt: number;
  name: string;
  createBy: string;
  lastUpdateBy: string;
  createAt: number;
  participants: string;
  triggeringCondition: string;
  preCondition: string;
  postCondition: string;
  priority: string;
  normalProcess: string;
  expansionProcess: string;
  specialNeeds: string;
  _id: string;
}

export interface IRequirement {
  _id: string;
  relatedRepoOwnerId: string;
  descriptions: IRequirementDescription[];
  relatedRepoName: string;
}

export interface IBranch {
  // 分支名稱
  name: string;
  // 提交SHA
  commitHeadSha: string;
}

export interface ICommitChanges {
  sha: string;
  // 含路徑
  filename: string;
  // 狀態
  status: string;
  additions: number;
  deletions: number;
  //https://stackoverflow.com/questions/8279602/what-is-a-patch-in-git-version-control
  patch: string;
  // 修改的文件內容
  rawContent: string;
}

export interface IRecentRepo {
  _id: string;
  name: string;
  language: ProgramLanguage;
  lastUpdateBy: string;
  lastUpdateAt: number;
  description: string;
}

export interface ICommit {
  sha: string;
  changedFiles: ICommitChanges[];
  message: string;
  committer: { id?: string } | null;
  committedAt: number;
  author: { id: string } | null;
  parents: {
    sha: string;
  }[];
  stats: { total: number; additions: number; deletions: number };
}

export type ShaFileContentMap = { [key: string]: string };

export interface IImportedRepository {
  _id: string;
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

  /**
   * @key file's sha
   * @value file's content
   */
  shaFileContentMap: ShaFileContentMap;
}

export interface IFileTreeNode {
  // 唯一標識
  sha: string;
  // 文件名稱不含路徑
  path: string;

  fullyQualifiedName: string;
  // 類型
  type: "FOLDER" | "FILE";
  // 子樹
  subTrees: IFileTreeNode[] | null;
}
