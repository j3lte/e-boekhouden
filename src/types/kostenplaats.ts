import { WithErrorMsg } from "./generic";

export interface Kostenplaats {
  KostenplaatsId: number;
  Omschrijving: string;
  KostenplaatsParentId: number;
}
export interface GetKostenplaatsenResult {
  GetKostenplaatsenResult: WithErrorMsg & {
    Kostenplaatsen: {
      cKostenplaats: Kostenplaats[];
    } | null;
  };
}

export interface KostenplaatsFilter {
  KostenplaatsID?: number;
  KostenplaatsParentID?: number;
  Omschrijving?: string;
}
