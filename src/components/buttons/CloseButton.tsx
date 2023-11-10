import "../../css/buttons/closeBtn.css";
import React from 'react';
import {RxCross1} from 'react-icons/rx';

interface Props {
  handleOnClick: React.MouseEventHandler;
}

const CloseButton = (props: Props) => {
  return (
    <RxCross1 className="close-btn" onClick={props.handleOnClick} />
  );
};

export default CloseButton;