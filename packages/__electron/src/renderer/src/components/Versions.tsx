import { useState } from 'react';

import type { ElectronAPI } from '@electron-toolkit/preload';

const getElectron = (): ElectronAPI | undefined =>
  (window as Window & { electron?: ElectronAPI }).electron;

type VersionMap = ElectronAPI['process']['versions'];

function Versions(): JSX.Element | null {
  const [versions] = useState<VersionMap | undefined>(() => getElectron()?.process?.versions);

  if (!versions) {
    return null;
  }

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  );
}

export default Versions;
