import "../../css/buttons/toggleButton.css";
import React from 'react';
import { useState } from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
  labelName: string
}

const ToggleButton = (props: Props) => {

    const [isOn, setIsOn] = useState(false);

    return (
        <div className={isOn ? "toggle-button" : "toggle-button active"} onClick={() => setIsOn(!isOn)}>
            <label>{props.labelName}</label>
            <div className="button-container">
                <button></button>
            </div>
        </div>
    );
};

export default ToggleButton;