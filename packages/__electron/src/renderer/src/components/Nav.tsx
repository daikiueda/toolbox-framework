import React from 'react';

import classnames from 'classnames';
import styled from 'styled-components';

import '@spectrum-css/sidenav';
import Box from '@spectrum-icons/workflow/Box';

import { Flex, Header, Heading } from '@toolbox/design-system';

import { Entry as MenuItemEntry } from '../../../../entries';

import Versions from './Versions';

type Props = {
  menuItems: { [appKey: string]: MenuItemEntry };
  currentApp: MenuItemEntry;
  switchApp: (app: MenuItemEntry) => () => void;
};

const NavPanel = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
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
    --mod-sidenav-max-width: 'auto';

    && {
      margin-inline: 24px;
    }
  `,

  Item: styled.li.attrs<{ selected?: boolean }>(({ selected }) => ({
    className: classnames(['spectrum-SideNav-item', { 'is-selected': selected }]),
  }))`
    margin-left: -12px;
    margin-right: -12px;
  `,

  _ItemLink: styled.a.attrs({
    className: 'spectrum-SideNav-itemLink',
    href: '#',
  })`
    svg {
      margin: 7px 6px 0 0;
    }
  `,

  _LinkText: styled.span.attrs({
    className: 'spectrum-SideNav-link-text',
  })``,

  Link: ({
    children,
    Icon,
    ...itemLinkProps
  }: React.ComponentProps<typeof Spectrum._ItemLink> & {
    Icon?: MenuItemEntry['Icon'];
  }) => (
    <Spectrum._ItemLink {...itemLinkProps}>
      {Icon && <Icon size="S" />}
      <Spectrum._LinkText>{children}</Spectrum._LinkText>
    </Spectrum._ItemLink>
  ),
};

const Nav: React.FC<Props> = ({ menuItems, currentApp, switchApp, ...navPanelProps }) => {
  return (
    <NavPanel {...navPanelProps}>
      {/* スクロール可能な上部エリア */}
      <Flex direction="column" flex="1" UNSAFE_style={{ overflow: 'auto' }}>
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
              <Spectrum.Link onClick={switchApp(entry)} Icon={entry.Icon}>
                {entry.label}
              </Spectrum.Link>
            </Spectrum.Item>
          ))}
        </Spectrum.SideNav>
      </Flex>

      {/* 固定表示の下部エリア */}
      <Flex direction="column" marginTop="auto">
        <Versions />
      </Flex>
    </NavPanel>
  );
};

export default React.memo(Nav);
