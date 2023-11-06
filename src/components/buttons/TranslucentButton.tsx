import "../../css/buttons/translucent-btn.css";
import React from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const TranslucentButton = (props: Props) => {
  return (
    <button className={"translucent-btn"} onClick={props.handleOnClick}>{props.children}</button>
  );
};

export default TranslucentButton;