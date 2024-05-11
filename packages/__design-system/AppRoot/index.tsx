import React from 'react';

import { Flex, View } from '../Components/Layout';

import ThemeProvider from './ThemeProvider';

type Props = {
  children: React.ReactNode;
};

const AppRoot: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider>
      <View width="100%" minHeight="100vh" backgroundColor="gray-75">
        <Flex>{children}</Flex>
      </View>
    </ThemeProvider>
  );
};
export default AppRoot;
