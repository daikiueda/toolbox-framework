import React from 'react';

import GlobalThemeProvider from '../AppRoot/GlobalThemeProvider';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => React.createElement(GlobalThemeProvider, null, React.createElement(Story)),
  ],
};

export default preview;
