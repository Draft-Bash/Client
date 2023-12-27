import '../../css/PickList.css';
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
  itemList: (string | number)[];
  value?: string | number;
  width?: number;
  setValue: (item: string | number) => void;
  key?: string | number; // Add a key prop to force re-render
}

const PickList: React.FC<Props> = ({ itemList, value, width = 500, setValue, key }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(value !== undefined ? value : null);
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

  useEffect(() => {
    setSelectedItem(value !== undefined ? value : null);
  }, [value]);

  return (
    <div key={key} ref={listRef} className="pick-list">
      <div onClick={() => setIsOpen(!isOpen)} className="input">
        <input
          readOnly
          style={{ width: `${width}px` }}
          type="text"
          value={selectedItem as string}
          ref={inputRef}
        />
        <div ref={arrowRef}>
          <FaChevronDown className="chevron-down" />
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
    </div>
  );
};

export default PickList;