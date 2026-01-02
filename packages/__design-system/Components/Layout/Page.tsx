import React from 'react';

import styled from 'styled-components';

import useAppEnv from '../../hooks/useAppEnv';
import { style } from '../../style' with { type: 'macro' };

type Props = {
  className?: string;
  children: React.ReactNode;
};

const PageContainer = styled.div`
  width: 100%;
`;

const PageBody = styled.div`
  max-width: 960px;
`;

const COMMON_SPACING = {
  paddingX: 28,
  paddingBottom: 56,
} as const;

const pageBodySpacing = (onElectron: boolean | undefined) =>
  onElectron
    ? style({
        ...COMMON_SPACING,
        marginX: 0,
      })
    : style({
        ...COMMON_SPACING,
        marginX: 'auto',
      });

const Page: React.FC<Props> = ({ className, children }) => {
  const appEnv = useAppEnv();

  return (
    <PageContainer className={className}>
      <PageBody className={pageBodySpacing(appEnv.onElectron)}>{children}</PageBody>
    </PageContainer>
  );
};

export default Page;
