import { Client } from "soap";
import { SoapAction, WithErrorMsg } from "./types";

export const executeClientMethod = async <T>(
  client: Client,
  method: SoapAction,
  options: Record<string, unknown>
): Promise<{ error: Error | null; result: T | null }> => {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    client[method](options, (err: Error | null, result: T) => {
      if (err) {
        resolve({ error: err, result: null });
      } else {
        resolve({ error: null, result });
      }
    });
  });
};

export const handleResultError = (result: unknown, method?: string) => {
  const msgPrefix = method ? `[executing: ${method}]` : "";
  const firstKey = Object.keys(result as Record<string, unknown>)[0];
  const error = (result as Record<string, unknown>)[
    firstKey
  ] as Partial<WithErrorMsg> | null;
  if (
    error?.ErrorMsg &&
    (error.ErrorMsg.LastErrorCode !== "" ||
      error.ErrorMsg.LastErrorDescription !== "")
  ) {
    throw new Error(
      `Error ${msgPrefix}:${error.ErrorMsg.LastErrorCode ?? "UNKNOWN"}: ${
        error.ErrorMsg.LastErrorDescription ?? "UNKNOWN"
      }`
    );
  }
};

export const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
