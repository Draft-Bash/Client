import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
  itemList: (string | number)[];
  defaultValue?: string | number;
  setValue: (item: string | number) => void;
  width?: number;
  height?: number;
}

const RoundedPickList: React.FC<Props> = ({ itemList, defaultValue, width = 500, height = 30, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(defaultValue !== undefined ? defaultValue : null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event) => {
    if (
      listRef.current &&
      !listRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      arrowRef.current &&
      !arrowRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <StyledRoundedPickList ref={listRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="input">
        <input readOnly style={{ width: `${width}px`, height: `${height}px` }} ref={inputRef} type="text" value={selectedItem as string} />
        <div ref={arrowRef}>
          <FaChevronDown className="chevron-down" style={{ height: `${height}px` }} />
        </div>
      </div>
      {isOpen && (
        <ul style={{ width: `${width + 30}px` }}>
          {itemList.map((item, index) => (
            <li
              className={item === selectedItem ? 'selected' : ''}
              onClick={() => {
                setValue(item);
                setSelectedItem(item);
                setIsOpen(false);
              }}
              key={index}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </StyledRoundedPickList>
  );
};

const StyledRoundedPickList = styled.div`
  position: relative;

  .input {
    display: flex;

    input {
      border: 1px solid var(--grey);
      border-right: none;
      font-size: 14px;
      padding-left: 15px;
      border-radius: 15px 0px 0px 15px;
      outline: none;
      cursor: pointer;
    }

    .chevron-down {
      background-color: white;
      width: 30px;
      color: var(--darkGrey);
      padding: 7px;
      border-left: none;
      cursor: pointer;
      border: 1px solid var(--grey);
      border-left: none;
      border-radius: 0px 15px 15px 0px;
    }
  }

  ul {
    position: absolute;
    background-color: white;
    width: 100%;
    border: 1px solid var(--black);
    max-height: 200px;
    overflow: auto;
    z-index: 10;

    li {
      padding: 3px 6px 3px 6px;
      cursor: pointer;
      transition: 0.3s;

      &.selected,
      &:hover {
        background-color: var(--lightGrey);
      }
    }
  }
`;

export default RoundedPickList;