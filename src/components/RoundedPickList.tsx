import '../css/roundedPickList.css';
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
  itemList: (string | number)[];
  defaultValue?: string | number;
  setValue: (item: string | number) => void;
  width?: number;
  height?: number;
}

const RoundedPickList: React.FC<Props> = ({ itemList, defaultValue, width = 500, height=30, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    defaultValue !== undefined ? defaultValue : null
  );
  const listRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event) => {
    if (event.target != listRef.current && event.target.tagName != "LI") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Watch for changes in the defaultValue prop
    setSelectedItem(defaultValue !== undefined ? defaultValue : null);
  }, [defaultValue]); // Trigger the effect when defaultValue changes

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
    };
  }, []);

  return (
    <div className="rounded-pick-list">
      <div onClick={() => setIsOpen(!isOpen)} className="input">
        <input readOnly style={{ width: `${width}px`, height: `${height}px` }} type="text" value={selectedItem as string} />
        <FaChevronDown className="chevron-down" style={{ height: `${height}px` }} />
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

export default RoundedPickList;