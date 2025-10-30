import React from 'react';

import styled from 'styled-components';

import { View } from '@react-spectrum/view';

import useAppEnv from '../../hooks/useAppEnv';

import { OneLine } from './Space';

type Props = React.ComponentProps<typeof View> & {
  className?: string;
};

const PageContainer = styled.div`
  width: 100%;
`;

const Page: React.FC<Props> = ({ className, children, ...viewProps }) => {
  const appEnv = useAppEnv();

  const innerProps = React.useMemo(
    () => (appEnv.onElectron ? {} : { margin: '0 auto' }),
    [appEnv.onElectron]
  );

  return (
    <PageContainer className={className}>
      <View
        paddingX="single-line-height"
        maxWidth="960px"
        paddingBottom={`calc(${OneLine} * 2)`}
        {...innerProps}
        {...viewProps}
      >
        {children}
      </View>
    </PageContainer>
  );
};

export default Page;
