import "../../css/buttons/toggleButton.css";
import React, { useState, useEffect } from 'react';

interface Props {
  handleOnClick: React.MouseEventHandler<HTMLDivElement>;
  labelName: string;
  defaultToggleState?: boolean;
}

const ToggleButton = (props: Props) => {
  const [isOn, setIsOn] = useState(props.defaultToggleState || false);

  // Function to toggle the state and call the provided click handler
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOn(!isOn); // Toggle the state
    props.handleOnClick(event); // Call the provided click handler
  };

  // Listen for changes in the defaultToggleState prop
  useEffect(() => {
    setIsOn(props.defaultToggleState || false); // Update the state when the prop changes
  }, [props.defaultToggleState]);

  return (
    <div className={isOn ? "toggle-button active" : "toggle-button"} onClick={handleClick}>
      <label>{props.labelName}</label>
      <div className="button-container">
        <button></button>
      </div>
    </div>
  );
};

export default ToggleButton;