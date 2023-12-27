import React from 'react';
import styled from 'styled-components';

interface Props {
  placeholder: string;
  isPassword?: boolean;
  onChange(inputValue: string): void;
  value?: string;
}

const TextInput: React.FC<Props> = (props) => {
  return (
    <StyledInput
      type={props.isPassword ? 'password' : 'text'}
      spellCheck={false}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

const StyledInput = styled.input`
  padding: 10px;
  font-size: 15px;
  width: 100%;
  border: 1px solid var(--grey);
  border-radius: 4px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  outline: none;

  &:focus {
    border-color: var(--brightBlue);
  }
`;

export default TextInput;