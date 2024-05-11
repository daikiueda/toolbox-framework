import React from 'react';

import { View } from '@react-spectrum/view';

type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  return (
    <View width="100%">
      <View paddingX="single-line-height" maxWidth="960px" margin="auto">
        {children}
      </View>
    </View>
  );
};

export default Page;
