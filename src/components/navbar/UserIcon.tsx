import React from 'react';
import styled from 'styled-components';
import { BiUserCircle } from 'react-icons/bi';
import { useAuth } from '../../contexts/AuthContext';

const UserIcon = () => {
  const { setIsAuthenticated } = useAuth();

  return (
    <StyledUserIcon>
      <BiUserCircle className="nav-icon" />
      <ul>
        <li
          onClick={() => {
            localStorage.removeItem('jwt_token');
            setIsAuthenticated(false);
          }}
        >
          Logout
        </li>
      </ul>
    </StyledUserIcon>
  );
};

const StyledUserIcon = styled.div`
  position: relative;
  height: 50px;
  padding-top: 7px;

  .nav-icon {
    color: var(--coolWhite);
    height: 35px;
    width: 50px;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
      background-color: rgba(100, 100, 125, 0.2);
    }
  }

  ul {
    position: absolute;
    border-radius: 5px;
    display: none;
    padding: 10px;
    top: 50px;
    left: -12px;
    background-color: var(--grey);
    z-index: 100;
  }

  &:hover ul {
    display: block;
  }

  li {
    cursor: pointer;
    opacity: 0.8;
    color: black;

    &:hover {
      opacity: 1;
    }
  }
`;

export default UserIcon;