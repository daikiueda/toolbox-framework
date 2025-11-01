import { OrgDetail } from '../../src/models';

const PREFIX = 'template:';

export const TEMPLATE_CHANNELS = {
  getOrgDetail: `${PREFIX}get-org-detail`,
} as const;

export type TemplateChannel = (typeof TEMPLATE_CHANNELS)[keyof typeof TEMPLATE_CHANNELS];

export type TemplateAPI = {
  getOrgDetail: () => Promise<OrgDetail>;
};
