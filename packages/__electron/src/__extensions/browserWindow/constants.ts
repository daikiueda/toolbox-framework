const PREFIX = 'browser-window:';

export const BROWSER_WINDOW_CHANNELS = {
  setTitle: `${PREFIX}set-title`,
} as const;

export type BrowserWindowChannel =
  (typeof BROWSER_WINDOW_CHANNELS)[keyof typeof BROWSER_WINDOW_CHANNELS];

export type BrowserWindowAPI = {
  setTitle: () => Promise<void>;
};
