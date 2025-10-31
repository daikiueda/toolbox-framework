import React, { useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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

  return (
    <SalesforceProvider>
      <Root>
        <SalesforceConnectionBarContainer />
        <Main>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={24} maxSize={24}>
              <PaneLeft>
                <Nav menuItems={entries} currentApp={currentApp} switchApp={switchApp} />
              </PaneLeft>
            </Panel>
            <Handle />
            <Panel defaultSize={70} minSize={20}>
              <PaneRight>{CurrentApp && <CurrentApp />}</PaneRight>
            </Panel>
          </PanelGroup>
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
  display: grid;
  grid-template-rows: fit-content(24px) 1fr;
`;

const Main = styled.div`
  min-height: 0;
`;

const PaneBase = styled.div`
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
`;

const PaneLeft = styled(PaneBase)`
  border-right: 1px solid var(--spectrum-gray-200);
`;

const PaneRight = styled(PaneBase)``;

const Handle = styled(PanelResizeHandle)`
  width: 4px;
  position: relative;
  cursor: col-resize;
  background: transparent;

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
