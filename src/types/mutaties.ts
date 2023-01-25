import { WithErrorMsg } from "./generic";

export type MutatieSoort =
  | "OpeningsSaldo"
  | "FactuurOntvangen"
  | "FactuurVerstuurd"
  | "FactuurbetalingOntvangen"
  | "FactuurbetalingVerstuurd"
  | "GeldOntvangen"
  | "GeldUitgegeven"
  | "Memoriaal";

export interface MutatieRegel {
  BedragInvoer: number;
  BedragExclBTW: number;
  BedragBTW: number;
  BedragInclBTW?: number;
  BTWCode?: string;
  BTWPercentage?: number;
  Factuurnummer: string;
  TegenrekeningCode: string;
  KostenplaatsID: number;
}
export interface Mutatie {
  MutatieNr: number;
  Soort: MutatieSoort;
  Datum: Date;
  Rekening: string;
  RelatieCode: string;
  Factuurnummer: string;
  Boekstuk: string;
  Omschrijving: string;
  Betalingstermijn: string;
  InExBTW: string;
  MutatieRegels?: {
    cMutatieListRegels: MutatieRegel[];
  };
}
export interface GetMutatiesResult {
  GetMutatiesResult: WithErrorMsg & {
    Mutaties: {
      cMutatieList: Mutatie[];
    } | null;
  };
}

export interface MutatieFilter {
  MutatieNr?: number;
  MutatieNrVan?: number;
  MutatieNrTm?: number;
  Factuurnummer?: string;
  DatumVan?: Date;
  DatumTm?: Date;
}

export type AddMutatieInfo = Partial<Mutatie> &
  Pick<
    Mutatie,
    | "Soort"
    | "Datum"
    | "Rekening"
    | "RelatieCode"
    | "Factuurnummer"
    | "Omschrijving"
    | "Betalingstermijn"
  > & {
    MutatieRegels: (Omit<MutatieRegel, "KostenplaatsID"> & {
      KostenplaatsID?: number;
    })[];
  };

export type AddMutatieResult = WithErrorMsg & {
  Mutatienummer: number;
};
