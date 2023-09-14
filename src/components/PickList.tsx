import '../css/pickList.css';
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
  itemList: (string | number)[];
  defaultValue?: string | number;
  width?: number;
  setValue: (item: string | number) => void;
}

const PickList: React.FC<Props> = ({ itemList, defaultValue, width = 500, setValue }) => {
  // State for tracking whether the picklist is open
  const [isOpen, setIsOpen] = useState(false);

  // State for storing the selected item (defaulted to null if not provided)
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    defaultValue !== undefined ? defaultValue : null
  );

  // Reference to the <ul> element for detecting clicks outside the picklist
  const listRef = useRef<HTMLUListElement>(null);

  // Function to handle clicks outside of the picklist
  const handleClickOutside = (event) => {
    if (event.target != listRef.current && event.target.tagName != "LI") {
      setIsOpen(false);
    }
  };

  // Add event listener to detect clicks outside the picklist
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as EventListener);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
    };
  }, []);

  return (
    <div className="pick-list">
      <div onClick={() => setIsOpen(!isOpen)} className="input">
        <input readOnly style={{ width: `${width}px` }} type="text" value={selectedItem as string} />
        <FaChevronDown className="chevron-down" />
      </div>
      {isOpen && (
        <ul ref={listRef} style={{ width: `${width + 30}px` }}>
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