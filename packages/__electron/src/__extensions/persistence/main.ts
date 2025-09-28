import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

import { app, ipcMain } from 'electron';

import { PERSISTENCE_CHANNELS, type PersistenceChannel } from './shared';

type SettingsRecord = Record<string, unknown>;

const USER_SETTINGS_FILE_NAME = 'user-settings.json';

const isString = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

class UserSettingsStore {
  private cache: SettingsRecord = {};

  private loaded = false;

  private filePath: string | null = null;

  private async ensureLoaded() {
    if (this.loaded) {
      return;
    }

    const userDataPath = app.getPath('userData');
    const filePath = join(userDataPath, USER_SETTINGS_FILE_NAME);

    this.filePath = filePath;

    try {
      const raw = await readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as SettingsRecord;
      if (parsed && typeof parsed === 'object') {
        this.cache = parsed;
      }
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        console.warn('[electron][persistence] 設定ファイルの読み込みに失敗しました:', err);
      }
      this.cache = {};
    }

    this.loaded = true;
  }

  private async persist() {
    if (!this.filePath) {
      return;
    }

    const directory = dirname(this.filePath);
    await mkdir(directory, { recursive: true });

    const payload = JSON.stringify(this.cache, null, 2);

    try {
      await writeFile(this.filePath, payload, 'utf-8');
    } catch (error) {
      console.warn('[electron][persistence] 設定ファイルの書き込みに失敗しました:', error);
    }
  }

  async read(scope: string) {
    await this.ensureLoaded();
    return this.cache[scope];
  }

  async write(scope: string, value: unknown) {
    await this.ensureLoaded();
    this.cache[scope] = value;
    await this.persist();
  }

  async delete(scope: string) {
    await this.ensureLoaded();
    if (scope in this.cache) {
      delete this.cache[scope];
      await this.persist();
    }
  }
}

const store = new UserSettingsStore();

const validateScope = (scope: unknown): scope is string => {
  if (!isString(scope)) {
    console.warn('[electron][persistence] scope が無効です:', scope);
    return false;
  }
  return true;
};

const registerPersistenceHandlers = () => {
  const handleRead: Parameters<typeof ipcMain.handle>[1] = async (_event, scope: unknown) => {
    if (!validateScope(scope)) {
      return null;
    }
    return store.read(scope);
  };

  const handleWrite: Parameters<typeof ipcMain.handle>[1] = async (
    _event,
    scope: unknown,
    value: unknown
  ) => {
    if (!validateScope(scope)) {
      return false;
    }
    await store.write(scope, value);
    return true;
  };

  const handleDelete: Parameters<typeof ipcMain.handle>[1] = async (_event, scope: unknown) => {
    if (!validateScope(scope)) {
      return false;
    }
    await store.delete(scope);
    return true;
  };

  ipcMain.handle(PERSISTENCE_CHANNELS.read, handleRead);
  ipcMain.handle(PERSISTENCE_CHANNELS.write, handleWrite);
  ipcMain.handle(PERSISTENCE_CHANNELS.delete, handleDelete);
};

const unregisterPersistenceHandlers = () => {
  (Object.values(PERSISTENCE_CHANNELS) as PersistenceChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerPersistenceHandlers, unregisterPersistenceHandlers };
