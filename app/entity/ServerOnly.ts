import { ITraceLink, ICommit } from "./types";

export interface ITraceLinkHistory {
  _id: string;
  repoName: string;
  ownerId: string;
  confirmed: boolean;
  commit: ICommit;
  added: { traceLinks: ITraceLink[] };
  removed: { traceLinks: ITraceLink[] };
}

export type ProgramLanguage = string;
