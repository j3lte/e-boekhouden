import { SoapError, WithErrorMsg } from "./generic";
import { SaldoCategorie } from "./saldi";

export interface Grootboekrekening {
  ID: number;
  Code: string;
  Omschrijving: string;
  Categorie: SaldoCategorie;
  /**
   * @reserved Niet in gebruik
   */
  Groep: string;
}
export interface GetGrootboekrekeningenResult {
  GetGrootboekrekeningenResult: WithErrorMsg & {
    Rekeningen: {
      cGrootboekrekening: Grootboekrekening[];
    } | null;
  };
}
export interface GrootboekrekeningFilter {
  ID?: number;
  Code?: string;
  Categorie?: SaldoCategorie;
}

export enum AddGrootboekrekeningCategorie {
  BAL = "BAL",
  VW = "VW",
}

/**
 * Used when creating a ledger account
 *
 * From the documentation:
 * Field | Type | Required | Max length | Translation | Description
 * --- | --- | --- | --- | --- | ---
 * ID | Int | N | | ID | Reserved, always use 0.
 * Code | String | Y | 10 | Code | The ledger account code has to be unique.
 * Omschrijving | String | Y | 50 | Description |
 * Categorie | String | Y | 10 | Category | BAL: Balans (balance), VW: Verlies & Winst (profit & loss)
 * Groep | String | N | | Group | Not used
 */
export type AddGrootboekrekeningInfo = Pick<
  Grootboekrekening,
  "Code" | "Omschrijving"
> & {
  Categorie: AddGrootboekrekeningCategorie;
};

export interface AddGrootboekrekeningResult {
  AddGrootboekrekeningResult: WithErrorMsg & {
    Gb_ID: number;
  };
}

export type UpdateGrootboekrekeningInfo = Pick<
  Grootboekrekening,
  "ID" | "Code" | "Omschrijving"
> & {
  Categorie: AddGrootboekrekeningCategorie;
};

export interface UpdateGrootboekrekeningResult {
  UpdateGrootboekrekeningResult: SoapError;
}
