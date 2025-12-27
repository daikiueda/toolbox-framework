import { type AuthFields, AuthInfo } from '@salesforce/core';

export type AuthOrg = {
  username: string;
  alias?: string;
  instanceUrl: string;
  isDefaultDevHub: boolean;
  isDefaultOrg: boolean;
};

/**
 * Salesforce CLI で認証済みの組織一覧を取得
 */
export const getAuthenticatedOrgs = async (): Promise<AuthOrg[]> => {
  try {
    const authInfos = await AuthInfo.listAllAuthorizations();

    return authInfos
      .filter((authInfo) => authInfo.instanceUrl !== undefined)
      .map((authInfo) => ({
        username: authInfo.username,
        alias: authInfo.aliases?.[0],
        instanceUrl: authInfo.instanceUrl!,
        isDefaultDevHub: authInfo.isDevHub ?? false,
        // Note: OrgAuthorization doesn't have isDefaultUsername property
        isDefaultOrg: false,
      }));
  } catch (error) {
    console.error('[SfdxAuthService] 認証済み組織一覧取得エラー:', error);
    return [];
  }
};

/**
 * 指定したユーザー名の認証情報を取得
 */
export const getAuthInfo = async (usernameOrAlias: string): Promise<AuthFields> => {
  const authInfo = await AuthInfo.create({ username: usernameOrAlias });
  return authInfo.getFields();
};
