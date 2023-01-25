import { WithErrorMsg } from "./generic";

/**
 * BTW codes
 *
 * | Code | Omschrijving | Opmerking |
 * | --- | --- | --- |
 * | **HOOG_VERK** | BTW hoog, verkopen | |
 * | **HOOG_VERK_21** | BTW hoog, verkopen 21% | |
 * | **LAAG_VERK** | BTW laag, verkopen | _Indien de boekdatum in 2019 of er na valt, wordt 9% aangehouden, daarvoor 6%._ |
 * | **LAAG_VERK_9** | BTW laag, verkopen 9% | |
 * | **VERL_VERK_L9** | BTW Verlegd 9% (1e op de btw-aangifte) | |
 * | **VERL_VERK** | BTW Verlegd 21% (1e op de btw-aangifte) | |
 * | **AFW** | Afwijkend btw-tarief | |
 * | **BU_EU_VERK** | Leveringen naar buiten de EU 0% | |
 * | **BI_EU_VERK** | Goederen naar binnen de EU 0% | |
 * | **BI_EU_VERK_D** | Diensten naar binnen de EU 0% | |
 * | **AFST_VERK** | Afstandsverkopen naar binnen de EU 0% | |
 * | **LAAG_INK** | BTW laag, inkopen | _Indien de boekdatum in 2019 of er na valt, wordt 9% aangehouden, daarvoor 6%._ |
 * | **LAAG_INK_9** | BTW laag, inkopen 9% | |
 * | **VERL_INK_L9** | BTW verlegd, laag, inkopen | |
 * | **HOOG_INK** | BTW hoog, inkopen | |
 * | **HOOG_INK_21** | BTW hoog, inkopen 21% | |
 * | **VERL_INK** | BTW verlegd, hoog, inkopen | |
 * | **AFW_VERK** | Afwijkend btw-tarief verkoop | |
 * | **BU_EU_INK** | Leveringen/diensten van buiten de EU 0% | |
 * | **BI_EU_INK** | Leveringen/diensten van binnen de EU 0% | |
 * | **GEEN** | Geen BTW | |
 */
export enum BTWCode {
  HOOG_VERK = "HOOG_VERK",
  HOOG_VERK_21 = "HOOG_VERK_21",
  LAAG_VERK = "LAAG_VERK",
  LAAG_VERK_9 = "LAAG_VERK_9",
  VERL_VERK_L9 = "VERL_VERK_L9",
  VERL_VERK = "VERL_VERK",
  AFW = "AFW",
  BU_EU_VERK = "BU_EU_VERK",
  BI_EU_VERK = "BI_EU_VERK",
  BI_EU_VERK_D = "BI_EU_VERK_D",
  AFST_VERK = "AFST_VERK",
  LAAG_INK = "LAAG_INK",
  LAAG_INK_9 = "LAAG_INK_9",
  VERL_INK_L9 = "VERL_INK_L9",
  HOOG_INK = "HOOG_INK",
  HOOG_INK_21 = "HOOG_INK_21",
  VERL_INK = "VERL_INK",
  AFW_VERK = "AFW_VERK",
  BU_EU_INK = "BU_EU_INK",
  BI_EU_INK = "BI_EU_INK",
  GEEN = "GEEN",
}

export interface FactuurRegel {
  Aantal: number;
  Eenheid: string;
  Code: string;
  Omschrijving: string;
  PrijsPerEenheid?: number;
  BTWCode: BTWCode;
  TegenrekeningCode: string;
  KostenplaatsID: number;
}
export interface Factuur {
  Factuurnummer: string;
  RelatieCode: unknown;
  Datum: Date;
  Betalingstermijn: number;
  TotaalExclBTW: number;
  TotaalBTW: number;
  TotaalInclBTW: number;
  TotaalOpenstaand: number;
  URLPDFBestand: string;
  Regels?: {
    cFactuurRegels: FactuurRegel[];
  };
}
export interface GetFacturenResult {
  GetFacturenResult: WithErrorMsg & {
    Facturen: {
      cFactuurList: Factuur[];
    } | null;
  };
}

export interface FactuurFilter {
  Factuurnummer?: string;
  Relatiecode?: string;
  DatumVan?: Date;
  DatumTm?: Date;
}

export type AddFactuurInfo = Partial<Factuur> &
  Pick<Factuur, "RelatieCode" | "Datum"> & {
    Factuursjabloon: string;
    Regels: (Partial<FactuurRegel> &
      Pick<
        FactuurRegel,
        "Code" | "Omschrijving" | "BTWCode" | "TegenrekeningCode"
      >)[];
  };

export interface AddFactuurResult {
  AddFactuurResult: WithErrorMsg & {
    Factuurnummer: string;
  };
}
