import '../css/pickList.css';
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { FaChevronDown } from 'react-icons/fa';


interface Props {
  itemList: string[] | number[];
  defaultValue?: string | number;
  width?: number;
  setValue: (item: string | number) => void;
}

const PickList: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setSelectedItem(props.defaultValue);
  }, [props.defaultValue]);

  const handleSelectedItem = (item: string | number) => {
    setSelectedItem(item);
    props.setValue(item);
    setIsOpen(false);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (listRef.current && !listRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  
    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="pick-list">
      <div onClick={() => setIsOpen(!isOpen)} className="input">
        <input readOnly style={{ width: `${props.width}px`}} type="text" value={selectedItem} />
        <FaChevronDown className="chevron-down" />
      </div>
      {isOpen && (
        <ul ref={listRef} style={{ width: `${props.width + 30}px` }}>
          {props.itemList.map((item, index) => (
            <li className={(item == selectedItem ? "selected": "")}
                onClick={() => {handleSelectedItem(item)}} 
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

PickList.defaultProps = {
  width: 500,
};

export default PickList;