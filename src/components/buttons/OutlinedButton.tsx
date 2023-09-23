import "../../css/buttons/outlinedButton.css";
import React from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const OutlinedButton = (props: Props) => {
  return (
    <button className={"outlined-button "} onClick={props.handleOnClick}>{props.children}</button>
  );
};

export default OutlinedButton;