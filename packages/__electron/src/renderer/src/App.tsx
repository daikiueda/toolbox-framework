import React, { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

import { SalesforceConnectionBarContainer, SalesforceProvider } from '@toolbox/salesforce';

import entries, { Entry as AppEntry } from '../../../entries';

import Nav from './components/Nav';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState(Object.values(entries)[0]);

  const switchApp = useCallback(
    (nextApp: AppEntry) => () => setCurrentApp(nextApp),
    [setCurrentApp]
  );

  const CurrentApp = useMemo(() => currentApp.App, [currentApp]);

  const singleScreenApp = Object.keys(entries).length === 1;

  return (
    <SalesforceProvider>
      <Root>
        <SalesforceConnectionBarContainer showOnlyWhileConnected />
        <Main>
          {singleScreenApp ? (
            <CurrentApp />
          ) : (
            <MainPanelGroup orientation="horizontal">
              <Panel defaultSize={25} minSize="200px" maxSize="300px">
                <PaneLeft>
                  <Nav menuItems={entries} currentApp={currentApp} switchApp={switchApp} />
                </PaneLeft>
              </Panel>
              <Handle />
              <Panel defaultSize={75}>
                <PaneRight>{CurrentApp && <CurrentApp />}</PaneRight>
              </Panel>
            </MainPanelGroup>
          )}
        </Main>
      </Root>
    </SalesforceProvider>
  );
};
export default App;

/* ===== styled-components ===== */
const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const MainPanelGroup = styled(PanelGroup)`
  height: 100%;
  position: relative;
`;

const Main = styled.div`
  flex: 1;

  &:has(${MainPanelGroup}) {
    overflow-y: hidden;
  }
`;

const PaneBase = styled.div`
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
`;

const PaneLeft = styled(PaneBase)`
  background: var(--spectrum-gray-50);
`;

const PaneRight = styled(PaneBase)``;

const Handle = styled(PanelResizeHandle)`
  width: 4px;
  position: relative;
  background: transparent;
  outline-color: var(--spectrum-blue-600);

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    transform: translateX(-0.5px);
    background: rgba(0, 0, 0, 0.08);
  }
`;
