import styled from 'styled-components';
import React from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  color: string;
}

const RoundedButton = (props: Props) => {
  return (
    <StyledRoundedButton>
      <button className={"rounded-button "+props.color} onClick={props.handleOnClick}>
        {props.children}
      </button>
    </StyledRoundedButton>
  );
};

const StyledRoundedButton = styled.div<Props>`

  border: none;

  .rounded-button {
    border: none;
    outline: none;
    border-radius: 25px;
    padding: 10px 25px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 18px;
    width: 100%;
  }

  .rounded-button.blue {
    background-color: var(--blue);
    color: white;
  }

  .rounded-button.yellow {
      background-color: var(--yellow);
      color: white;
  }

  .rounded-button:hover {
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  }
`;

export default RoundedButton;