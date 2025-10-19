import jsforce, { type Connection, type QueryResult } from 'jsforce';

import type { OrgInfo, SalesforceTokens } from '../models';

export class SalesforceConnection {
  // Singleton
  private static instance: SalesforceConnection | null = null;
  private constructor() {
    console.log('インスタンス生成');
  }
  static getInstance() {
    if (!SalesforceConnection.instance) {
      SalesforceConnection.instance = new SalesforceConnection();
    }
    return SalesforceConnection.instance;
  }
  static getConnection = (): Connection | null => {
    return this.instance?.conn ?? null;
  };

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

  getOrgInfo = async (): Promise<OrgInfo> => {
    if (!this.conn) {
      throw new Error('接続が確立されていません');
    }

    const identity = await this.conn.identity();
    const userId = identity.user_id;

    const userInfo = await this.conn.query<{ Id: string; Email: string; Username: string }>(
      `SELECT Id, Email, Username FROM User WHERE Id = '${userId}'`
    );

    const user = userInfo.records[0];

    return {
      orgId: identity.organization_id,
      orgName: identity.organization_id, // TODO: 組織名の取得方法を確認
      username: user?.Username || '',
      email: user?.Email || '',
      userId: identity.user_id,
    };
  };

  getUserInfo = async () => {
    if (!this.conn) {
      throw new Error('接続が確立されていません');
    }

    return this.conn.identity();
  };

  query = async <T extends Record<string, unknown> = Record<string, unknown>>(
    soql: string
  ): Promise<QueryResult<T>> => {
    if (!this.conn) {
      throw new Error('接続が確立されていません');
    }

    return this.conn.query<T>(soql);
  };
}
