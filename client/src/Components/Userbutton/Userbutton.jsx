import React, { useState, useEffect, useRef } from 'react';
import './Userbutton.css'; // Assuming your CSS is in this file
import Logout from '../Logout/Logout';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Userbutton = ({ userId, userFirstname, userLastname }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
        setIsUserSidebarOpen(true);
    };

   const handleClickOutside = (event) => {
    if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
    ) {
        setIsDropdownOpen(false);
    }
};

    const handleResize = () => {
        if (window.innerWidth > 768 && isUserSidebarOpen) {
            setIsUserSidebarOpen(false);
        }

    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isUserSidebarOpen]);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <>
        <div className="userbutton-container">
            <button className="userbutton" onClick={toggleDropdown} ref={buttonRef}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" fill="#000000" />
                </svg>
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu" >
                  <Link to={`/profile/${userFirstname}-${userLastname}/${userId}`} className='links'>Profiles</Link>
<Link
    className="links"
    to={`/savedjobs/${userId}`}
    onClick={() => {
        setIsDropdownOpen(false);
        setIsUserSidebarOpen(false);
    }}
>
    Saved Jobs
</Link>

                    <Logout />
                </div>
            )}
           {isDropdownOpen && ( < div className={`sidebar ${isUserSidebarOpen ? 'sidebar_open' : ''}`} ref={dropdownRef}>
                {/* Close Icon */}
                <div className="close_icon" onClick={() => setIsUserSidebarOpen(false)} aria-label="Close navigation menu">
                    &times;
                </div>
                <div className="sidebar_links">
                    <Link to={`/profile/${userFirstname}-${userLastname}/${userId}`} className='dropdown-links'>Profile</Link>
                    {/* Pass userdata via state when navigating to savedjobs */}
                    <Link className='dropdown-links' to={`/savedjobs/${userId}`}>
                        Saved Job
                    </Link>
                    <Logout  />

                </div>
            </div>  )}
        </div>
        </>
    );
};

export default Userbutton;
