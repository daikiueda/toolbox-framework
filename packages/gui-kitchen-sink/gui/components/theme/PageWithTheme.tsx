import styled from 'styled-components';

import { Page } from '@toolbox/design-system';

const PageWithTheme = styled(Page)`
  background-color: var(--spectrum-gray-25);

  :root & {
    [role='row'] {
      &[data-selected='true'] {
        --rowBackgroundColor: var(--spectrum-yellow-100);
      }
      &[data-hovered='true'] {
        --rowBackgroundColor: var(--spectrum-yellow-200);
      }
    }
  }

  & {
    *:is(h1, h2, h3, h4, h5, h6) {
      color: var(--spectrum-blue-900);
    }
  }
`;

export default PageWithTheme;
