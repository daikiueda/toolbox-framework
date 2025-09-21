import React from 'react';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

import entries, { Entry as AppEntry } from '../../../entries';

import Nav from './components/Nav';

const TopPanel = styled(Panel)`
  min-height: 100vh;
`;
const TopResizeHandle = styled(PanelResizeHandle)``;

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = React.useState(Object.values(entries)[0]);

  const switchApp = React.useCallback(
    (nextApp: AppEntry) => () => setCurrentApp(nextApp),
    [setCurrentApp]
  );

  const CurrentApp = React.useMemo(() => currentApp.App, [currentApp]);

  return (
    <PanelGroup direction="horizontal">
      <Nav maxSize={24} menuItems={entries} currentApp={currentApp} switchApp={switchApp} />
      <TopResizeHandle />
      <TopPanel>{CurrentApp && <CurrentApp />}</TopPanel>
    </PanelGroup>
  );
};

export default App;
