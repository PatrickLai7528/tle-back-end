import { ITraceLink, ICommit } from './types';

export interface ITraceLinkHistory {
   _id: string;
   commit: ICommit,
   added: { traceLinks: ITraceLink[] },
   removed: { traceLinks: ITraceLink[] }
}

export type ProgramLanguage = string;
