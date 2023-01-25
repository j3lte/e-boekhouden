import { WithErrorMsg } from "./generic";

export interface GetSaldoResult {
  GetSaldoResult: WithErrorMsg & {
    Saldo: number;
  };
}

export interface SaldoFilter {
  GbCode: string;
  KostenPlaatsId: number;
  DatumVan?: Date;
  DatumTot?: Date;
}
