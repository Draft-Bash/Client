import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import UserIcon from './UserIcon';

const Navbar = () => {
  return (
    <StyledNavbar>
      <Link to="/modules/drafts" className="option">
        Mock Drafts
      </Link>
      <UserIcon />
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  background-color: var(--black);
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 50px 0px 50px;
  gap: 30px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--mediumDarkGrey);

  .option {
    color: white;
    height: 35px;
    line-height: 35px;
    padding: 0px 10px 0px 10px;
    border-radius: 8px;
  }
  .option:hover {
    background-color: rgba(100, 100, 125, 0.2);
  }
  .option.active {
    background-color: rgba(100, 100, 125, 0.2);
  }
`;

const StyledLink = styled(Link)`
  color: white;
  height: 35px;
  line-height: 35px;
  padding: 0px 10px 0px 10px;
  border-radius: 8px;

  &:hover {
    background-color: rgba(100, 100, 125, 0.2);
  }

  &.active {
    background-color: rgba(100, 100, 125, 0.2);
  }
`;

export default Navbar;