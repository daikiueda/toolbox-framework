import React from 'react';

import AppIcon from '@react-spectrum/s2/icons/Buildings';

import { Heading } from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };
import { useSalesforce } from '@toolbox/salesforce';

import OrgDetailView from './components/OrgDetailView';
import PageWithTheme from './components/PageWithTheme';

const App: React.FC = () => {
  const { LoginGate } = useSalesforce();

  return (
    <LoginGate>
      <PageWithTheme>
        <Heading level={1}>
          <AppIcon styles={iconStyle({ size: 'XL' })} />
          Template
        </Heading>
        <div className={style({ display: 'flex', flexDirection: 'column', gap: 32 })}>
          <OrgDetailView />
        </div>
      </PageWithTheme>
    </LoginGate>
  );
};

export default App;
export { AppIcon };
