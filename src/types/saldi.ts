import { WithErrorMsg } from "./generic";

/**
 * SaldoCategorie
 *
 * | Code | Omschrijving |
 * | ---- | ------------- |
 * | AF19 | BTW Af te dragen Hoog |
 * | AF6 | Btw Af te dragen Laag |
 * | AFOVERIG | BTW Af te dragen Overig |
 * | BAL | Overige balansrekeningen |
 * | BTWRC | BTW R/C |
 * | CRED | Crediteurenrekening(en) |
 * | DEB | Debiteurenrekening(en) |
 * | FIN | Financiële rekeningen (kas, bank, etc.) |
 * | VOOR | Voorbelasting |
 * | VW | Verlies- en Winstrekening |
 */
export enum SaldoCategorie {
  AF19 = "AF19",
  AF6 = "AF6",
  AFOVERIG = "AFOVERIG",
  BAL = "BAL",
  BTWRC = "BTWRC",
  CRED = "CRED",
  DEB = "DEB",
  FIN = "FIN",
  VOOR = "VOOR",
  VW = "VW",
}
export interface Saldo {
  ID: number;
  Code: string;
  Categorie: SaldoCategorie;
  Saldo: number;
}

export interface GetSaldiResult {
  GetSaldiResult: WithErrorMsg & {
    Saldi: {
      cSaldo: Saldo[];
    } | null;
  };
}
export interface SaldiFilter {
  KostenPlaatsId: number;
  DatumVan?: Date;
  DatumTot?: Date;
  Categorie?: SaldoCategorie;
}
