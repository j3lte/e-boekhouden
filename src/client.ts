import { Client, createClientAsync } from "soap";
import { executeClientMethod, handleResultError, wait } from "./helpers";
import {
  GetFacturenResult,
  Factuur,
  Administratie,
  FactuurFilter,
  GetAdministratiesResult,
  ArtikelFilter,
  Artikel,
  GetArtikelenResult,
  GrootboekrekeningFilter,
  Grootboekrekening,
  GetGrootboekrekeningenResult,
  SoapAction,
  KostenplaatsFilter,
  GetKostenplaatsenResult,
  Kostenplaats,
  Mutatie,
  MutatieFilter,
  GetMutatiesResult,
  OpenPost,
  OpenPostenSoort,
  GetOpenPostenResult,
  Relatie,
  GetRelatiesResult,
  RelatieFilter,
  SaldiFilter,
  Saldo,
  GetSaldiResult,
  GetSaldoResult,
  SaldoFilter,
  GenericSessionResult,
  AddGrootboekrekeningResult,
  AddGrootboekrekeningInfo,
  UpdateGrootboekrekeningInfo,
  UpdateGrootboekrekeningResult,
  AddRelatieInfo,
  AddRelatieResult,
  UpdateRelatieInfo,
  UpdateRelatieResult,
} from "./types";

/**
 * Options to create a new EboekhoudenClient
 *
 * In order to create a new EboekhoudenClient you need to provide the **username** and **security codes** of your e-boekhouden account.
 */
export interface EboekhoudenClientOptions {
  /**
   * The username of the e-boekhouden account
   */
  username: string;
  /**
   * SecurityCode1 (Beveiligingscode 1) of the e-boekhouden account
   *
   * This can be found in the e-boekhouden settings (Beheer > Instellingen > API/SOAP)
   */
  code1: string;
  /**
   * SecurityCode2 (Beveiligingscode 2) of the e-boekhouden account
   *
   * This can be found in the e-boekhouden settings (Beheer > Instellingen > API/SOAP)
   */
  code2: string;
  /**
   * The GUID of the e-boekhouden administratie
   *
   * @optional This is only used by accountants
   */
  administratieGuid?: string;
  /**
   * The URL of the e-boekhouden SOAP API
   *
   * @optional defaults to `"https://soap.e-boekhouden.nl/soap.asmx?wsdl"`
   */
  url?: string;
  /**
   * Enable debug logging
   *
   * @optional defaults to `false`
   */
  debug?: boolean;
  /**
   * The number of retries to perform when a SOAP call fails
   *
   * @optional defaults to `3`
   */
  retries?: number;
}

/**
 * The e-boekhouden client
 *
 * This client can be used to interact with the e-boekhouden SOAP API.
 * @category Main
 */
export class EboekhoudenClient {
  /**
   * The username of the e-boekhouden account
   */
  private readonly _username: string;
  /**
   * SecurityCode1 (Beveiligingscode 1) of the e-boekhouden account
   */
  private readonly _code1: string;
  /**
   * SecurityCode2 (Beveiligingscode 2) of the e-boekhouden account
   */
  private readonly _code2: string;
  /**
   * The URL of the e-boekhouden SOAP API.
   * This defaults to `"https://soap.e-boekhouden.nl/soap.asmx?wsdl"`, but can be overridden in the constructor.
   */
  private readonly _url: string;
  /**
   * Enable debug logging
   */
  private readonly _debug: boolean;
  /**
   * The number of retries to perform when a SOAP call fails. This defaults to `3`, but can be overridden in the constructor.
   */
  private readonly _retries: number;
  /**
   * The GUID of the e-boekhouden administratie. This is used by accountants to access their clients' administraties.
   * Defaults to `null`, but can be overridden in the constructor.
   */
  private _administratieGuid: string | null = null;

  /**
   * The SOAP client used to communicate with the e-boekhouden SOAP API. This is lazily initialized.
   * @see `getSoapClient`
   */
  private _soapClient: Client | null = null;
  /**
   * The session ID used to authenticate with the e-boekhouden SOAP API. This is lazily initialized.
   * @see `getSessionID`
   */
  private _sessionID: string | null = null;

  /**
   * Construct a new EboekhoudenClient
   *
   * @param options The options for the client
   */
  constructor({
    username,
    code1,
    code2,
    administratieGuid,
    url,
    debug,
    retries,
  }: EboekhoudenClientOptions) {
    this._username = username;
    this._code1 = code1;
    this._code2 = code2;
    this._administratieGuid = administratieGuid ?? null;
    this._url = url ?? "https://soap.e-boekhouden.nl/soap.asmx?wsdl";
    this._debug = debug ?? false;
    this._retries = retries ?? 3;
  }

  /**
   * Get the options that are used to get a session ID. We add the `AdministratieGUID` if it is set (used for accountants).
   */
  private get _baseSessionOptions() {
    const baseOptions = {
      Username: this._username,
      SecurityCode1: this._code1,
      SecurityCode2: this._code2,
      Source: "NodeJS_SDK",
    };
    if (this._administratieGuid) {
      return { ...baseOptions, AdministratieGUID: this._administratieGuid };
    }
    return baseOptions;
  }

  private _executeClientMethod = async <T>(
    method: SoapAction,
    options: Record<string, unknown>,
    retries = this._retries
  ): Promise<{ error: Error | null; result: T | null }> => {
    const client = await this.getSoapClient();
    const { error, result } = await executeClientMethod<T>(
      client,
      method,
      options
    );
    if (retries > 0 && error) {
      if (this._debug) {
        console.log(`Retrying ${method} left ${retries}...`);
      }
      await wait(1000);
      return this._executeClientMethod<T>(method, options, retries - 1);
    }
    return { error, result };
  };

  private _executeAuthenticatedClientMethod = async <T>(
    method: SoapAction,
    options?: Record<string, unknown>,
    retries = this._retries
  ): Promise<{
    error: Error | null;
    result: T | null;
  }> => {
    const sessionID = await this.getSessionID();
    const baseOptions = {
      SecurityCode2: this._code2,
      SessionID: sessionID,
    };
    const clientOptions = { ...baseOptions, ...options };

    return this._executeClientMethod<T>(method, clientOptions, retries);
  };

  private _handleResultError = (
    error: Error | null,
    result: unknown | null,
    method: string
  ) => {
    if (error || !result) {
      throw error ?? new Error(`No result returned for method ${method}`);
    }
    handleResultError(result, method);
  };

  private debug = (message: unknown, dir = false) => {
    if (this._debug) {
      dir
        ? console.dir(message, { depth: null })
        : console.log(`[DEBUG]`, message);
    }
  };

  private debugResult = (method: string, result: unknown) => {
    this.debug(`[${method} START]`);
    this.debug(result, false);
  };

  private _getClientSessionIDGeneric = async (): Promise<string> => {
    const method = this._administratieGuid
      ? SoapAction.OpenSessionSub
      : SoapAction.OpenSession;
    const { error, result } =
      await this._executeClientMethod<GenericSessionResult>(
        method,
        this._baseSessionOptions
      );

    this._handleResultError(
      error,
      result,
      this._administratieGuid ? "OpenSessionSub" : "OpenSession"
    );

    if (!result) {
      throw new Error("No result returned");
    }

    if (result.OpenSessionResult?.SessionID) {
      return result.OpenSessionResult.SessionID;
    }

    if (result.OpenSessionSubResult?.SessionID) {
      return result.OpenSessionSubResult.SessionID;
    }

    throw new Error("No session ID returned");
  };

  /**
   * Initializes the client by getting a session ID.
   * When this is executed in a NodeJS environment, it will also register a handler to close the session when the process exits.
   */
  public async init(): Promise<void> {
    try {
      await this.getSessionID();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (global.process) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        global.process.on("exit", async () => await this.closeSession());
      }
    } catch (error) {
      console.error("Error initializing client", error);
    }
  }

  /**
   * Get the client instance
   *
   * @returns Soap client instance
   * @see https://github.com/vpulim/node-soap#client
   */
  public async getSoapClient(): Promise<Client> {
    if (this._soapClient) {
      return this._soapClient;
    }

    this._soapClient = await createClientAsync(this._url, {
      envelopeKey: "soap",
      wsdl_options: {
        xmlKey: "$xml",
        overrideRootElement: {
          namespace: "xmlns:soap",
        },
      },
    });

    return this._soapClient;
  }

  /**
   * Get the session ID
   *
   * @returns Session ID
   * @throws Error when no session ID is returned
   */
  public async getSessionID(): Promise<string> {
    if (this._sessionID) {
      return this._sessionID;
    }

    this._sessionID = await this._getClientSessionIDGeneric();

    return this._sessionID;
  }

  /**
   * This function adds ledger accounts
   *
   * @param opts Grootboekrekening options
   * @returns Grootboekrekening ID
   * @throws Error when no grootboekrekening ID is returned
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=AddGrootboekrekening
   */
  public async addGrootboekrekening(
    opts: AddGrootboekrekeningInfo
  ): Promise<number | null> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<AddGrootboekrekeningResult>(
        SoapAction.AddGrootboekrekening,
        {
          oGb: {
            ID: 0,
            ...opts,
          },
        }
      );

    this._handleResultError(error, result, "addGrootboekrekening");
    this.debugResult("addGrootboekrekening", result);

    return result?.AddGrootboekrekeningResult.Gb_ID ?? null;
  }

  /**
   * This function adds relations to your system. Code and company name are mandatory.
   *
   * @param opts Relatie options
   * @returns Relatie ID
   * @throws Error when no relatie ID is returned
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=AddRelatie
   */
  public async addRelatie(opts: AddRelatieInfo): Promise<number | null> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<AddRelatieResult>(
        SoapAction.AddRelatie,
        {
          oRel: {
            ...opts,
          },
        }
      );

    this._handleResultError(error, result, "addRelatie");
    this.debugResult("addRelatie", result);

    return result?.AddRelatieResult.Rel_ID ?? null;
  }

  /**
   * Close the session
   */
  public async closeSession(): Promise<void> {
    if (!this._sessionID) {
      return;
    }

    await this._executeClientMethod(SoapAction.CloseSession, {
      SessionID: this._sessionID,
    });

    this._sessionID = null;
  }

  /**
   * Get a list of administraties
   *
   * @returns List of administraties
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetAdministraties
   */
  public async getAdministraties(): Promise<Administratie[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetAdministratiesResult>(
        SoapAction.GetAdministraties
      );

    this._handleResultError(error, result, "getAdministraties");
    this.debugResult("getAdministraties", result);

    return result?.GetAdministratiesResult.Administraties.cAdministratie ?? [];
  }

  /**
   * Get a list of artikelen
   *
   * @param filter Filter options
   * @returns List of artikelen
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetArtikelen
   */
  public async getArtikelen(filter: ArtikelFilter = {}): Promise<Artikel[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetArtikelenResult>(
        SoapAction.GetArtikelen,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getArtikelen");
    this.debugResult("getArtikelen", result);

    return result?.GetArtikelenResult.Artikelen?.cArtikel ?? [];
  }

  /**
   * Get a list of facturen
   *
   * @param filter Filter options
   * @returns List of facturen
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetFacturen
   */
  public async getFacturen(filter: FactuurFilter = {}): Promise<Factuur[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetFacturenResult>(
        SoapAction.GetFacturen,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getFacturen");
    this.debugResult("getFacturen", result);

    return result?.GetFacturenResult.Facturen?.cFactuurList ?? [];
  }

  /**
   * Get a list of grootboekrekeningen
   *
   * @param filter Filter options
   * @returns List of grootboekrekeningen
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetGrootboekrekeningen
   */
  public async getGrootboekrekeningen(
    filter: GrootboekrekeningFilter = {}
  ): Promise<Grootboekrekening[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetGrootboekrekeningenResult>(
        SoapAction.GetGrootboekrekeningen,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getGrootboekrekeningen");
    this.debugResult("getGrootboekrekeningen", result);

    return (
      result?.GetGrootboekrekeningenResult.Rekeningen?.cGrootboekrekening ?? []
    );
  }

  /**
   * Get a list of kostenplaatsen
   *
   * @param filter Filter options
   * @returns List of kostenplaatsen
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetKostenplaatsen
   */
  public async getKostenplaatsen(
    filter: KostenplaatsFilter = {}
  ): Promise<Kostenplaats[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetKostenplaatsenResult>(
        SoapAction.GetKostenplaatsen,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getKostenplaatsen");
    this.debugResult("getKostenplaatsen", result);

    return result?.GetKostenplaatsenResult.Kostenplaatsen?.cKostenplaats ?? [];
  }

  /**
   * Get a list of mutaties
   *
   * @param filter Filter options
   * @returns List of mutaties
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetMutaties
   */
  public async getMutaties(filter: MutatieFilter = {}): Promise<Mutatie[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetMutatiesResult>(
        SoapAction.GetMutaties,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getMutaties");
    this.debugResult("getMutaties", result);

    return result?.GetMutatiesResult.Mutaties?.cMutatieList ?? [];
  }

  /**
   * Get a list of open posten
   *
   * @param soort Soort open posten
   * @returns List of open posten
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetOpenPosten
   */
  public async getOpenPosten(soort: OpenPostenSoort): Promise<OpenPost[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetOpenPostenResult>(
        SoapAction.GetOpenPosten,
        {
          OpSoort: soort,
        }
      );

    this._handleResultError(error, result, "getOpenPosten");
    this.debugResult("getOpenPosten", result);

    return result?.GetOpenPostenResult.Openposten?.cOpenPost ?? [];
  }

  /**
   * Get a list of relaties
   *
   * @param filter Filter options
   * @returns List of relaties
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetRelaties
   */
  public async getRelaties(filter: RelatieFilter = {}): Promise<Relatie[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetRelatiesResult>(
        SoapAction.GetRelaties,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getRelaties");
    this.debugResult("getRelaties", result);

    return result?.GetRelatiesResult.Relaties?.cRelatie ?? [];
  }

  /**
   * Get a list of saldi
   *
   * @param filter Filter options
   * @returns List of saldi
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetSaldi
   */
  public async getSaldi(filter: SaldiFilter): Promise<Saldo[]> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetSaldiResult>(
        SoapAction.GetSaldi,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getSaldi");
    this.debugResult("getSaldi", result);

    return result?.GetSaldiResult.Saldi?.cSaldo ?? [];
  }

  /**
   * Get the saldo
   *
   * @param filter Filter options
   * @returns Saldo
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=GetSaldo
   */
  public async getSaldo(filter: SaldoFilter): Promise<number> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<GetSaldoResult>(
        SoapAction.GetSaldo,
        {
          cFilter: filter,
        }
      );

    this._handleResultError(error, result, "getSaldo");
    this.debugResult("getSaldo", result);

    return result?.GetSaldoResult.Saldo ?? -1;
  }

  /**
   * Update a grootboekrekening
   *
   * @param opts Options
   * @returns void
   * @throws {Error} If the result is not successful
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=UpdateGrootboekrekening
   */
  public async updateGrootboekrekening(
    opts: UpdateGrootboekrekeningInfo
  ): Promise<void> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<UpdateGrootboekrekeningResult>(
        SoapAction.UpdateGrootboekrekening,
        {
          oGb: {
            ...opts,
          },
        }
      );

    this._handleResultError(error, result, "updateGrootboekrekening");
    this.debugResult("updateGrootboekrekening", null);

    return;
  }

  /**
   * Update a relatie
   *
   * @param opts Options
   * @returns void
   * @throws {Error} If the result is not successful
   * @see https://soap.e-boekhouden.nl/soap.asmx?op=UpdateRelatie
   */
  public async updateRelatie(opts: UpdateRelatieInfo): Promise<void> {
    const { error, result } =
      await this._executeAuthenticatedClientMethod<UpdateRelatieResult>(
        SoapAction.UpdateRelatie,
        {
          oRel: {
            ...opts,
          },
        }
      );

    this._handleResultError(error, result, "updateRelatie");
    this.debugResult("updateRelatie", result);

    return;
  }
}
