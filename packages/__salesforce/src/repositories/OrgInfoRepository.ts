import { SalesforceConnection } from '../../lib';
import { OrgInfo } from '../models/OrgInfo';

export const getOrgInfo = async (): Promise<OrgInfo> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();

  const organizationResult = await conn.query<{ Id: string; Name: string; IsSandbox: boolean }>(
    `SELECT Id, Name, IsSandbox FROM Organization WHERE Id = '${identity.organization_id}'`
  );
  const organization = organizationResult.records[0];

  return {
    orgId: identity.organization_id,
    orgName: organization?.Name ?? '',
    orgType: organization?.IsSandbox ? 'Sandbox' : 'Production',
    instanceUrl: conn.instanceUrl,
  };
};
