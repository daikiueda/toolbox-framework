export type OrgDetail = {
  orgId: string;
  orgName: string;
  orgType: 'Production' | 'Sandbox';
  organizationType: string;
  instanceName: string;
};
export const OrgDetail = {
  default: (): OrgDetail => ({
    orgId: '',
    orgName: '',
    orgType: 'Production',
    organizationType: '',
    instanceName: '',
  }),
};
