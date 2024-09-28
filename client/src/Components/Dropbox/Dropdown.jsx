// src/components/Dropdown.js

import React from 'react';
import './Dropdown.css'; // Add your styles for the dropdown here

const Dropdown = ({ items, onItemClick }) => {
    return (
        <div className="dropdown">
            <button className="dropdown-button">Menu</button>
            <div className="dropdown-content">
                {items.map((item, index) => (
                    <a key={index} href="#" onClick={() => onItemClick(item)}>
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
