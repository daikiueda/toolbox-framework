import jsforce, { type Connection } from 'jsforce';

import type { SalesforceTokens } from './auth/SalesforceTokens';

const SF_API_VERSION_FALLBACK = '60.0';

export class SalesforceConnection {
  // Singleton
  private static instance: SalesforceConnection | null = null;
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

  private conn: Connection | null = null;

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
  };
  disconnect = (): void => {
    this.conn = null;
  };
}
