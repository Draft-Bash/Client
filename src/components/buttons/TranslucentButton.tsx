import React from 'react';
import styled from 'styled-components';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const TranslucentButton = (props: Props) => {
  return <StyledTranslucentButton onClick={props.handleOnClick}>{props.children}</StyledTranslucentButton>;
};

const StyledTranslucentButton = styled.button`
  background-color: var(--transparentOrange);
  font-weight: 500;
  color: var(--brightOrange);
  padding: 10px 25px 10px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: rgb(255, 165, 95);
    color: var(--black);
  }
`;

export default TranslucentButton;