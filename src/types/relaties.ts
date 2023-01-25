import { WithErrorMsg } from "./generic";

export enum Geslacht {
  Man = "m",
  Vrouw = "v",
  Onbekend = "",
}

export enum RelatieType {
  Particulier = "P",
  Bedrijf = "B",
}

export enum RelatieStatus {
  Standaard = "0",
  Ledenadministratie = "1",
}

export interface Relatie {
  ID: number;
  AddDatum: Date;
  /**
   * Code
   *
   * Code van de relatie. Deze code moet uniek zijn binnen de administratie
   */
  Code: string;
  /**
   * Bedrijf
   *
   * Indien het om een particulier gaat, dan hier de naam invullen
   */
  Bedrijf: string;
  /**
   * Contactpersoon
   *
   * In het geval van een particulier, wordt dit niet gebruikt.
   */
  Contactpersoon: string;
  Geslacht: Geslacht;
  Adres: string;
  Postcode: string;
  Plaats: string;
  Land: string;
  /**
   * Postadres
   */
  Adres2: string;
  /**
   * Postadres
   */
  Postcode2: string;
  /**
   * Postadres
   */
  Plaats2: string;
  /**
   * Postadres
   */
  Land2: string;
  Telefoon: string;
  GSM: string;
  FAX: string;
  Email: string;
  Site: string;
  Notitie: string;
  /**
   * @deprecated Use IBAN
   * @see IBAN
   */
  Bankrekening: string;
  /**
   * @deprecated Use IBAN
   * @see IBAN
   */
  Girorekening: string;
  BTWNummer: string;
  KvkNummer: string;
  Aanhef: string;
  IBAN: string;
  BIC: string;
  /**
   * RelatieType
   *
   * P = Particulier
   * B = Bedrijf
   */
  BP: RelatieType;
  Def1: string;
  Def2: string;
  Def3: string;
  Def4: string;
  Def5: string;
  Def6: string;
  Def7: string;
  Def8: string;
  Def9: string;
  Def10: string;
  /**
   * RelatieStatus
   *
   * Standard 0. Change only when you also use the members administration module. For members, use 1.
   */
  LA: RelatieStatus;
  Gb_ID: number;
  GeenEmail: number;
  /**
   * @reserved Can't be used in the API
   */
  NieuwsbriefgroepenCount: number;
}

export interface GetRelatiesResult {
  GetRelatiesResult: WithErrorMsg & {
    Relaties: {
      cRelatie: Relatie[];
    } | null;
  };
}

export interface RelatieFilter {
  Trefwoord?: string;
  Code?: string;
  ID?: number;
}

export type AddRelatieInfo = Partial<Relatie> &
  Pick<Relatie, "BP" | "Code" | "Bedrijf">;

export interface AddRelatieResult {
  AddRelatieResult: WithErrorMsg & {
    Rel_ID: number;
  };
}

export type UpdateRelatieInfo = Partial<Relatie> &
  Pick<Relatie, "ID" | "Code" | "Bedrijf" | "BP">;

export interface UpdateRelatieResult {
  LastErrorCode?: string;
  LastErrorDescription?: string;
}
