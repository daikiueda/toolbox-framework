import '@spectrum-css/sidenav';
import Box from '@spectrum-icons/workflow/Box';
import classnames from 'classnames';
import { Panel } from 'react-resizable-panels';
import styled from 'styled-components';

import React from 'react';

import { Heading } from '@toolbox/design-system/Components/Content';
import { Flex, Header } from '@toolbox/design-system/Components/Layout';

import { Entry as MenuItemEntry } from '../../../../entries';

import Versions from './Versions';

type Props = React.ComponentProps<typeof Panel> & {
  menuItems: { [appKey: string]: MenuItemEntry };
  currentApp: MenuItemEntry;
  switchApp: (app: MenuItemEntry) => () => void;
};

const NavPanel = styled(Panel)`
  min-height: 100vh;
  background-color: var(--spectrum-blue-100);

  h1 {
    color: var(--spectrum-blue-1300);
    font-weight: normal;
  }
`;

const Spectrum = {
  SideNav: styled.ul.attrs({
    className: `spectrum-SideNav`,
  })`
    --mod-sidenav-background-default: transparent;
    --mod-sidenav-background-disabled: transparent;
    --mod-sidenav-background-key-focus-selected: var(--spectrum-blue-300);
    --mod-sidenav-background-hover-selected: var(--spectrum-blue-300);
    --mod-sidenav-background-hover: var(--spectrum-blue-200);
    --mod-sidenav-background-key-focus: var(--spectrum-blue-200);
    --mod-sidenav-item-background-default-selected: var(--spectrum-blue-200);
    --mod-sidenav-item-background-down: var(--spectrum-blue-300);
    --mod-sidenav-item-background-down-selected: var(--spectrum-blue-300);

    && {
      margin-inline: 24px;
    }
  `,

  Item: styled.li.attrs<{ selected?: boolean }>(({ selected }) => ({
    className: classnames(['spectrum-SideNav-item', { 'is-selected': selected }]),
  }))``,

  _ItemLink: styled.a.attrs({
    className: 'spectrum-SideNav-itemLink',
    href: '#',
  })``,

  _LinkText: styled.span.attrs({
    className: 'spectrum-SideNav-link-text',
  })``,

  Link: ({ children, ...itemLinkProps }: React.ComponentProps<typeof Spectrum._ItemLink>) => (
    <Spectrum._ItemLink {...itemLinkProps}>
      <Spectrum._LinkText>{children}</Spectrum._LinkText>
    </Spectrum._ItemLink>
  ),
};

const Nav: React.ForwardRefRenderFunction<React.ComponentRef<typeof Panel>, Props> = (
  { menuItems, currentApp, switchApp, ...navPanelProps },
  ref
) => {
  return (
    <NavPanel tagName="nav" {...navPanelProps} ref={ref}>
      <Header marginX="24px">
        <Flex direction="row" alignItems="center">
          <Box color="informative" size="L" />
          <Heading level={1} marginStart="size-100" marginY="24px">
            Toolbox
          </Heading>
        </Flex>
      </Header>

      <Spectrum.SideNav>
        {Object.entries(menuItems).map(([appKey, entry]) => (
          <Spectrum.Item key={appKey} selected={entry.App === currentApp.App}>
            <Spectrum.Link onClick={switchApp(entry)}>{entry.label}</Spectrum.Link>
          </Spectrum.Item>
        ))}
      </Spectrum.SideNav>
      <Versions />
    </NavPanel>
  );
};

export default React.memo(React.forwardRef(Nav));
