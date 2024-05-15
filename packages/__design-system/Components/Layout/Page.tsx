import React from 'react';

import { View } from '@react-spectrum/view';
import useAppEnv from '../../hooks/useAppEnv';

type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  const appEnv = useAppEnv();

  const innerProps = React.useMemo(
    () => (appEnv.onElectron ? {} : { margin: '0 auto' }),
    [appEnv.onElectron]
  );

  return (
    <View width="100%">
      <View paddingX="single-line-height" maxWidth="960px" {...innerProps}>
        {children}
      </View>
    </View>
  );
};

export default Page;
