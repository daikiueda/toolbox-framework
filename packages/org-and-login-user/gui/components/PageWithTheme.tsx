import styled from 'styled-components';

import { Page } from '@toolbox/design-system';

const PageWithTheme = styled(Page)`
  & {
    *:is(h1, h2, h3, h4, h5, h6) {
      color: var(--spectrum-blue-900);
    }
  }
`;

export default PageWithTheme;
