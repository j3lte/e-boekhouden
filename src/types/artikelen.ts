import { WithErrorMsg } from "./generic";
export interface Artikel {
  ArtikelID: number;
  ArtikelOmschrijving: string;
  ArtikelCode: string;
  GroepOmschrijving: string;
  GroepCode: string;
  Eenheid: string;
  InkoopprijsExclBTW: number;
  VerkoopprijsExclBTW: number;
  VerkoopprijsInclBTW: number;
  BTWCode: string;
  TegenrekeningCode: string;
  BtwPercentage: number;
  KostenplaatsID: number;
  Actief: boolean;
}
export interface GetArtikelenResult {
  GetArtikelenResult: WithErrorMsg & {
    Artikelen: {
      cArtikel: Artikel[];
    } | null;
  };
}

export interface ArtikelFilter {
  ArtikelID?: number;
  ArtikelOmschrijving?: string;
  ArtikelCode?: string;
  GroepOmschrijving?: string;
  GroepCode?: string;
}
