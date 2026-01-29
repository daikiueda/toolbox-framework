const PREFIX = 'template:';

export const TEMPLATE_CHANNELS = {
  greet: `${PREFIX}greet`,
} as const;

export type TemplateChannel = (typeof TEMPLATE_CHANNELS)[keyof typeof TEMPLATE_CHANNELS];

export type TemplateAPI = {
  greet: (who: string) => Promise<string>;
};
