import styled from 'styled-components';

import _Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton = styled(_Skeleton)`
  --base-color: var(--spectrum-gray-200);
  --highlight-color: var(--spectrum-gray-100);
`;

export default Skeleton;
