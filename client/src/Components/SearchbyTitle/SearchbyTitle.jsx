import React, { useState, useEffect, useRef } from 'react';
import './SearchbyTitle.css';

const SearchbyTitle = ({ jobs, onJobSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTitles, setFilteredTitles] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const titles = jobs.map(job => job.title);
        const filtered = titles.filter(title => title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredTitles(filtered);
    }, [searchTerm, jobs]);

    const handleTitleSelect = (title) => {
        setSearchTerm(title);
        setDropdownVisible(false);
        onJobSelect(title); // Call the parent function
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='searchbytitle'>
            <input
                placeholder='Search by job title'
                className='job-title-search'
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDropdownVisible(true); // Show dropdown on input
                }}
                onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
            />
            {dropdownVisible && filteredTitles.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                    {filteredTitles.map((title, index) => (
                        <div 
                            key={index} 
                            className='dropdown-item' 
                            onClick={() => handleTitleSelect(title)}
                        >
                            {title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchbyTitle;
