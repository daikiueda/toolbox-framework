import jsforce from 'jsforce';

import type { OrgInfo, SalesforceTokens } from '../models';

export class SalesforceConnection {
  private conn: jsforce.Connection | null = null;

  connect = (tokens: SalesforceTokens): void => {
    this.conn = new jsforce.Connection({
      instanceUrl: tokens.instance_url,
      accessToken: tokens.access_token,
    });
  };

  getOrgInfo = async (): Promise<OrgInfo> => {
    if (!this.conn) {
      throw new Error('接続が確立されていません');
    }

    const [identity, userInfo] = await Promise.all([
      this.conn.identity(),
      this.conn.query<{ Id: string; Email: string; Username: string }>(
        'SELECT Id, Email, Username FROM User WHERE Id = :userId',
        { userId: this.conn.userInfo?.id }
      ),
    ]);

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

  query = async <T = unknown>(soql: string): Promise<jsforce.QueryResult<T>> => {
    if (!this.conn) {
      throw new Error('接続が確立されていません');
    }

    return this.conn.query<T>(soql);
  };

  disconnect = (): void => {
    this.conn = null;
  };

  getConnection = (): jsforce.Connection | null => {
    return this.conn;
  };
}
