const PREFIX = 'user-persistence:';

export const PERSISTENCE_CHANNELS = {
  read: `${PREFIX}read`,
  write: `${PREFIX}write`,
  delete: `${PREFIX}delete`,
} as const;

export type PersistenceChannel = (typeof PERSISTENCE_CHANNELS)[keyof typeof PERSISTENCE_CHANNELS];

export type PersistenceAPI = {
  read: (scope: string) => Promise<unknown>;
  write: (scope: string, value: unknown) => Promise<boolean>;
  delete: (scope: string) => Promise<boolean>;
};
