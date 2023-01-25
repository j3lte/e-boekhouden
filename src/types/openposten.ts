import { WithErrorMsg } from "./generic";
export interface OpenPost {
  MutDatum: Date;
  MutFactuur: string;
  RelCode: string;
  RelBedrijf: string;
  Bedrag: number;
  Voldaan: number;
  Openstaand: number;
}

export interface GetOpenPostenResult {
  GetOpenPostenResult: WithErrorMsg & {
    Openposten: {
      cOpenPost: OpenPost[];
    } | null;
  };
}

export enum OpenPostenSoort {
  Debiteuren = "Debiteuren",
  Crediteuren = "Crediteuren",
}
