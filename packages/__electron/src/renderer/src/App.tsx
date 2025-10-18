import React from 'react';

import styled from 'styled-components';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { SalesforceProvider } from '@toolbox/salesforce/src/context';

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
    <SalesforceProvider>
      <PanelGroup direction="horizontal">
        <Nav maxSize={24} menuItems={entries} currentApp={currentApp} switchApp={switchApp} />
        <TopResizeHandle />
        <TopPanel>{CurrentApp && <CurrentApp />}</TopPanel>
      </PanelGroup>
    </SalesforceProvider>
  );
};

export default App;
