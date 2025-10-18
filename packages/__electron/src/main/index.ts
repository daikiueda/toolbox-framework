import { join } from 'path';

import { electronApp, optimizer } from '@electron-toolkit/utils';
import { config } from 'dotenv';
import { BrowserWindow, app } from 'electron';

import {
  notifyProtocolUrl,
  registerSalesforceHandlers,
  unregisterSalesforceHandlers,
} from '@toolbox/salesforce/electron';

import {
  registerAppearanceHandlers,
  unregisterAppearanceHandlers,
} from '../__extensions/appearance/main';
import {
  registerBrowserWindowHandlers,
  unregisterBrowserWindowHandlers,
} from '../__extensions/browserWindow/main';
import {
  registerPersistenceHandlers,
  unregisterPersistenceHandlers,
} from '../__extensions/persistence/main';

import createWindow from './createWindow';

const registerHandlers = (window: BrowserWindow) => {
  registerAppearanceHandlers();
  registerPersistenceHandlers();
  registerBrowserWindowHandlers(window);
  registerSalesforceHandlers();
};

const unregisterHandlers = () => {
  unregisterAppearanceHandlers();
  unregisterPersistenceHandlers();
  unregisterBrowserWindowHandlers();
  unregisterSalesforceHandlers();
};

// 開発時のみプロジェクトルートの.env.localを読み込む
// 本番時（パッケージング済み）はOSの環境変数を使用
if (!app.isPackaged) {
  // 開発時: プロジェクトルートから相対パスで.env.localを読み込む
  config({ path: join(__dirname, '../../../.env.local') });
}

// カスタムURLスキームの登録
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('toolbox-framework', process.execPath, [
      join(process.cwd(), process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('toolbox-framework');
}

// macOS: open-urlイベントでカスタムプロトコルURLを受信
app.on('open-url', (event, url) => {
  event.preventDefault();
  console.log('[main] open-url イベント受信:', url);
  // Salesforceのプロトコルハンドラーに通知
  notifyProtocolUrl(url);
});

// Windows/Linux: second-instanceイベントでカスタムプロトコルURLを受信
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    // コマンドライン引数からカスタムプロトコルURLを探す
    const url = commandLine.find((arg) => arg.startsWith('toolbox-framework://'));
    if (url) {
      console.log('[main] second-instance イベント受信:', url);
      // Salesforceのプロトコルハンドラーに通知
      notifyProtocolUrl(url);
    }

    // ウィンドウがあればフォーカス
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      const mainWindow = windows[0];
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const mainWindow = createWindow();

  registerHandlers(mainWindow);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  unregisterHandlers();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
