import '../css/textInput.css';
import React, {useState} from 'react';

interface Props {
  placeholder: string
  isPassword?: boolean
  onChange(inputValue: string): void
  value?: string
}

const TextInput = (props: Props) => {
  return (
    <input 
      className="textInput" 
      type={props.isPassword ? "password" : "text"}
      spellCheck={false}  // Note: It should be spellCheck={false} instead of spellCheck="false"
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}
    />
  );
};

export default TextInput;