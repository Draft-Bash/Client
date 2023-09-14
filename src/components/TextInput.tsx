import '../css/textInput.css'; // Import CSS for styling
import React from 'react';

interface Props {
    placeholder: string; // Placeholder text for the input field
    isPassword?: boolean; // Optional boolean to indicate if it's a password input
    onChange(inputValue: string): void; // A callback function to handle input changes
}

const TextInput = (props: Props) => {
  return (
    <input 
      className="textInput" // Apply the "textInput" CSS class for styling
      type={props.isPassword ? "password" : "text"} // Set input type based on isPassword prop
      spellCheck={false} // Disable spell check for the input field
      placeholder={props.placeholder} // Set the placeholder text based on the prop
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)} // Call the onChange callback with the input value when the input changes
    />
  );
};

export default TextInput; // Export the TextInput component as the default export