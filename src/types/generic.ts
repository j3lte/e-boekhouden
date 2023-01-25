export interface SoapError {
  LastErrorCode?: string;
  LastErrorDescription?: string;
}

export interface WithErrorMsg {
  ErrorMsg: SoapError;
}

export enum SoapAction {
  AddFactuur = "AddFactuur",
  AddGrootboekrekening = "AddGrootboekrekening",
  AddMutatie = "AddMutatie",
  AddRelatie = "AddRelatie",
  AutoLogin = "AutoLogin",
  CloseSession = "CloseSession",
  GetAdministraties = "GetAdministraties",
  GetArtikelen = "GetArtikelen",
  GetFacturen = "GetFacturen",
  GetGrootboekrekeningen = "GetGrootboekrekeningen",
  GetKostenplaatsen = "GetKostenplaatsen",
  GetMutaties = "GetMutaties",
  GetOpenPosten = "GetOpenPosten",
  GetRelaties = "GetRelaties",
  GetSaldi = "GetSaldi",
  GetSaldo = "GetSaldo",
  OpenSession = "OpenSession",
  OpenSessionSub = "OpenSessionSub",
  UpdateGrootboekrekening = "UpdateGrootboekrekening",
  UpdateRelatie = "UpdateRelatie",
}
