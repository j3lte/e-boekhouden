import { WithErrorMsg } from "./generic";

export interface Administratie {
  Bedrijf: string;
  Plaats: string;
  Guid: string;
  StartBoekjaar: string;
}
export interface GetAdministratiesResult {
  GetAdministratiesResult: WithErrorMsg & {
    Administraties: {
      cAdministratie: Administratie[];
    };
  };
}
