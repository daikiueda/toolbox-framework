import { SalesforceConnection } from '@toolbox/salesforce/lib';

export type OrgDetail = {
  orgId: string;
  orgName: string;
};

export const getOrgDetail = async (): Promise<OrgDetail> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();

  return {
    orgId: identity.organization_id,
    orgName: identity.organization_id, // TODO: 組織名の取得方法を確認
  };
};
