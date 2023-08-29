import "../../css/buttons/outlinedRoundedButton.css";
import React from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  color: string;
}

const OutlinedRoundedButton = (props: Props) => {
  return (
    <button className={"outlined-rounded-button "+props.color} onClick={props.handleOnClick}>{props.children}</button>
  );
};

export default OutlinedRoundedButton;