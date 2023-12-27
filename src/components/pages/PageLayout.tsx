import styled from 'styled-components';
import Navbar from '../navbar/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout = () => {
  return (
    <StyledPageLayout>
      <Navbar />
      <StyledPageContainer>
        <Outlet />
      </StyledPageContainer>
    </StyledPageLayout>
  );
};

const StyledPageLayout = styled.div`
  background-color: var(--black);
  height: 100vh;
  overflow-y: hidden;
`;

const StyledPageContainer = styled.div`
  padding: 25px;
  height: calc(100% - 50px);
`;

export default PageLayout;