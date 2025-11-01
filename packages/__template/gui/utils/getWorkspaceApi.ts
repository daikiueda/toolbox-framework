import { type TemplateAPI } from '../electron';

type WorkspaceApiGetter = () => TemplateAPI;

export const getWorkspaceApi: WorkspaceApiGetter = () => {
  const api = (window.api as unknown as { template?: TemplateAPI })?.template;

  if (!api) {
    throw new Error('[template] preload API が利用できません');
  }

  return api;
};
