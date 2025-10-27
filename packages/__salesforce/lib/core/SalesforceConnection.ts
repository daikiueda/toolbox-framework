import jsforce, { type Connection } from 'jsforce';

import type { SalesforceTokens } from './auth/SalesforceTokens';

export class SalesforceConnection {
  // Singleton
  private static instance: SalesforceConnection | null = null;
  private constructor() {
    console.log('インスタンス生成');
  }
  static getInstance = () => {
    SalesforceConnection.instance ??= new SalesforceConnection();
    return SalesforceConnection.instance;
  };
  static getConnection = () => {
    if (!this.instance?.conn) {
      throw new Error('接続が確立されていません');
    }
    return this.instance.conn;
  };
  static isConnected = () => Boolean(this.instance?.conn);

  private conn: Connection | null = null;

  connect = (tokens: SalesforceTokens): void => {
    this.conn = new jsforce.Connection({
      instanceUrl: tokens.instance_url,
      accessToken: tokens.access_token,
    });
  };
  disconnect = (): void => {
    this.conn = null;
  };
}
