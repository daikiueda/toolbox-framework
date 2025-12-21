export type OrgType = 'Production' | 'Sandbox';

export type OrgInfo = {
  orgId: string;
  orgName: string;
  orgType: OrgType;
  instanceUrl: string;
};
