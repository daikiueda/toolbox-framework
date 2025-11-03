import { SalesforceConnection } from '@toolbox/salesforce/lib';

import { OrgDetail } from '../models';

export const getOrgDetail = async (): Promise<OrgDetail> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();
  const organizationId = identity.organization_id;

  // Organization オブジェクトから基本情報を取得
  const orgInfo = await conn.query<{
    Id: string;
    Name: string;
    IsSandbox: boolean;
    OrganizationType: string;
    InstanceName: string;
  }>(
    `SELECT Id, Name, IsSandbox, OrganizationType, InstanceName FROM Organization WHERE Id = '${organizationId}'`
  );

  const org = orgInfo.records[0];

  return {
    orgId: organizationId,
    orgName: org?.Name || '',
    orgType: org?.IsSandbox ? 'Sandbox' : 'Production',
    organizationType: org?.OrganizationType || '',
    instanceName: org?.InstanceName || '',
  };
};
