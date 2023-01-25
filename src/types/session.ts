import { WithErrorMsg } from "./generic";

export interface WithSessionID {
  SessionID: string;
}
export interface OpenSessionResult {
  OpenSessionResult: WithErrorMsg & WithSessionID;
}
export interface OpenSessionSubResult {
  OpenSessionSubResult: WithErrorMsg & WithSessionID;
}

export type GenericSessionResult = Partial<
  OpenSessionResult & OpenSessionSubResult
>;
