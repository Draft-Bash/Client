import '../css/textInput.css';
import React from 'react';

interface Props {
    placeholder: string
    isPassword?: boolean
    onChange(inputValue: string): void
}

const TextInput = (props: Props) => {



  return (
    <input 
      className="textInput" 
      type={props.isPassword ? "password" : "text"}
      spellCheck={false}  // Note: It should be spellCheck={false} instead of spellCheck="false"
      placeholder={props.placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}  // Use props.onChange here
    />
  );
};

export default TextInput;