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
        <Header>
          <Title>My App</Title>
          <SalesforceConnectionBarContainer />
        </Header>

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
const HEADER_H = 48;

const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: ${HEADER_H}px 1fr;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
`;

const Title = styled.div`
  flex: none;
  font-weight: 600;
`;

const Main = styled.div`
  min-height: 0;
`;

const PaneBase = styled.div`
  height: calc(100vh - ${HEADER_H}px);
  overflow: auto;
  overscroll-behavior: contain;
`;

const PaneLeft = styled(PaneBase)`
  border-right: 1px solid #e5e7eb;
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
