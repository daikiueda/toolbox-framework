import jsforce, { type Connection, type IdentityInfo } from 'jsforce';

import type { OrgInfo } from '../models/OrgInfo';

import type { SalesforceTokens } from './auth/SalesforceTokens';

const SF_API_VERSION_FALLBACK = '60.0';

export class SalesforceConnection {
  // Singleton
  private static instance: SalesforceConnection | null = null;

  // Caches
  private static identityPromise: Promise<IdentityInfo> | null = null;
  private static orgInfoPromise: Promise<OrgInfo> | null = null;
  private static resetCaches = () => {
    SalesforceConnection.identityPromise = null;
    SalesforceConnection.orgInfoPromise = null;
  };

  private constructor() {
    console.log('[salesforce] インスタンス生成');
  }
  static getInstance = () => {
    SalesforceConnection.instance ??= new SalesforceConnection();
    return SalesforceConnection.instance;
  };
  static getConnection = () => {
    if (!this.instance?.conn) {
      throw new Error('[salesforce] 接続が確立されていません');
    }
    return this.instance.conn;
  };
  static isConnected = () => Boolean(this.instance?.conn);
  static isConnectedWithSfdx = (): boolean => {
    return this.instance?.connectedWithSfdx ?? false;
  };

  private conn: Connection | null = null;
  private connectedWithSfdx: boolean = false;

  setConnectedWithSfdx = (value: boolean): void => {
    this.connectedWithSfdx = value;
  };

  connect = async ({ instance_url, access_token }: SalesforceTokens): Promise<void> => {
    const tokens = { instanceUrl: instance_url, accessToken: access_token };

    const preCheck = new jsforce.Connection(tokens);
    const versions = await preCheck.request<{ version: string }[]>(
      `${instance_url}/services/data/`
    );
    const latestVersion = versions.at(-1)?.version;

    this.conn = new jsforce.Connection({
      ...tokens,
      version: latestVersion ?? SF_API_VERSION_FALLBACK,
    });
    console.log(`[salesforce] APIバージョン: ${this.conn.version}`);

    SalesforceConnection.resetCaches();
  };

  disconnect = (): void => {
    this.conn = null;
    this.connectedWithSfdx = false;
    SalesforceConnection.resetCaches();
  };

  private static async fetchIdentity(): Promise<IdentityInfo> {
    const promise = this.identityPromise ?? SalesforceConnection.getConnection().identity();

    this.identityPromise = promise
      .then((identity) => identity)
      .catch((error) => {
        this.identityPromise = null;
        throw error;
      });

    return this.identityPromise;
  }

  static async getOrgInfo(): Promise<OrgInfo> {
    if (!this.orgInfoPromise) {
      this.orgInfoPromise = (async () => {
        const identity = await this.fetchIdentity();
        const conn = SalesforceConnection.getConnection();
        const organizationResult = await conn.query<{
          Id: string;
          Name: string;
          IsSandbox: boolean;
        }>(`SELECT Id, Name, IsSandbox FROM Organization WHERE Id = '${identity.organization_id}'`);

        const organization = organizationResult.records[0];

        return {
          orgId: identity.organization_id,
          orgName: organization?.Name ?? '',
          orgType: organization?.IsSandbox ? 'Sandbox' : 'Production',
          instanceUrl: conn.instanceUrl,
        } satisfies OrgInfo;
      })().catch((error) => {
        this.orgInfoPromise = null;
        throw error;
      });
    }

    return this.orgInfoPromise;
  }
}
