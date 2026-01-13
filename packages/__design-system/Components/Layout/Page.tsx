import React from 'react';

import styled from 'styled-components';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const PageContainer = styled.div`
  width: 100%;
`;

const PageBody = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 28px 56px;
`;
export const __PAGE_BODY_CLASS_NAME = PageBody.toString();

const Page: React.FC<Props> = ({ className, children }) => (
  <PageContainer className={className}>
    <PageBody>{children}</PageBody>
  </PageContainer>
);

export default Page;
