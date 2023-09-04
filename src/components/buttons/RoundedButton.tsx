import "../../css/buttons/roundedButton.css";
import React from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  color: string;
}

const RoundedButton = (props: Props) => {
  return (
    <button className={"rounded-button "+props.color} onClick={props.handleOnClick}>{props.children}</button>
  );
};

export default RoundedButton;