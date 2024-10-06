// Nav.js
import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import './Nav.css';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Userbutton from '../Userbutton/Userbutton';
import axios from 'axios'; // Import axios


const Nav = () => {
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // User Authentication Context
    const { state, dispatch } = useContext(UserContext);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputType, setInputType] = useState('password');

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Navigation
    const navigate = useNavigate();

    // User Data States
    const [userData, setUserData] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [userId, setUserId] = useState("");
    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");

    // Menu Items
    const menuItems = [
        {
            title: "Community",
            description: "Connect anonymously with professionals about work, pay, life, and more.",
            buttonText: "Start using OpportuNest",
            route: "/community"
        },
        {
            title: "Jobs",
            description: "Search millions of jobs by what matters to you and find the right fit.",
            buttonText: "Start using OpportuNest",
            route: "/jobs"
        },
        {
            title: "Companies",
            description: "Get a personalized salary estimate and compare with millions of salaries.",
            buttonText: "Start using OpportuNest",
            route: "/companies"
        },
        {
            title: "My Circle",
            description: "Review your career growth with a free personalized career review.",
            buttonText: "Start using OpportuNest",
            route: "/mycircle"
        }
    ];
   

    // Handle window resize to close sidebar on larger screens
    const handleResize = () => {
        if (window.innerWidth > 768 && isSidebarOpen) {
            setIsSidebarOpen(false);
        }

    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen]);

    // Email Check Function
    const emailCheck = async (e) => {
        e.preventDefault();

        if (!email) {
            window.alert("Please fill in email ");
            return;
        }

        try {
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/emailCheck', { email });

            if (res.status === 400 || !res.data) {
                setIsModalOpen(false);
                setIsRegisterModalOpen(true);
                window.alert("Email not found. Please register.");
            } else {
                dispatch({ type: "USER", payload: true });
                setIsModalOpen(false);
                setIsSignInModalOpen(true);
                window.alert("Email Found. Please sign in.");
            }
        } catch (error) {
            console.error(error);
            setIsModalOpen(false);
            setIsRegisterModalOpen(true);
            window.alert("An error occurred. Please try again.");
        }
    };

    // Password Check Function
    const passwordCheck = async (e) => {
        e.preventDefault();

        if (!password) {
            window.alert("Please fill in password ");
            return;
        }

        try {
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/logup', { email, password }, { withCredentials: true });

            if (res.status === 400 || !res.data) {
                window.alert("Incorrect password");
            } else {
                dispatch({ type: 'USER', payload: { isAuthenticated: true, user: res.data.user } });
                window.alert("User logged in");
                setIsSignInModalOpen(false);
                navigate("/community");
            }
        } catch (error) {
            console.error(error);
            window.alert("Error logging in");
        }
    };

    // Toggle Password Visibility
    const togglePasswordVisibility = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
    };

    // Registration Function
    const registerUser = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/signin', { email, password });

            if (res.status === 422 || !res.data) {
                window.alert("Invalid registration");
                console.log("Invalid registration");
            } else {
                window.alert("Successful registration");
                console.log("Successful registration");
                setIsRegisterModalOpen(false);
                setIsSignInModalOpen(true);
            }
        } catch (error) {
            console.error(error);
            window.alert("Error during registration");
        }
    };

    // Fetch User Data
    const fetchUserData = async () => {
        try {
            const res = await axios.get('https://opportunest-1.vercel.app/api/auth/user', { withCredentials: true });

            if (res.status === 401) {
                setUserData(null);
                console.log("User is unauthorized or logged out");
                return;
            }

            setUserId(res.data._id);
            setUserFirstname(res.data.basicdata[0].firstname);
            setUserLastname(res.data.basicdata[0].lastname);
            setUserData(res.data);

            if (res.status !== 200) {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.log(error);
            setUserData(null);
        }
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            fetchUserData();
        } else {
            setUserData(null);
        }
    }, [state.isAuthenticated]);

    return (
        <>
        

            <nav className="nav_content">
                {/* Logo */}
                <div className="logo_div">
                    <h1 className="logo_name">OpportuNest</h1>
                </div>

                {/* Navigation Links and Userbutton for Desktop */}
                <ul className="nav_links desktop-only">
                    {menuItems.map((item, index) => (
                        <li
                            className="nav_item"
                            key={index}
                            onMouseEnter={() => {
                                if (!userData) {
                                    setShowDropdown(index);
                                }
                            }}
                            onMouseLeave={() => setShowDropdown(null)}
                            onClick={() => {
                                if (userData) {
                                    navigate(item.route);
                                }
                            }}
                        >
                            {item.title}
                            {showDropdown === index && (
                                <div className="dropdown_nav">
                                    <p>{item.description}</p>
                                    <button onClick={() => setIsModalOpen(true)}>{item.buttonText}</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Userbutton for Desktop */}
                <div className="userbutton_div desktop-only">
                    {state.isAuthenticated ? (
                        <Userbutton userId={userId} userFirstname={userFirstname} userLastname={userLastname} />
                    ) : (
                        <button className="sign_in_button" onClick={() => setIsModalOpen(true)}>
                            Sign In
                        </button>
                    )}
                </div>
                <div className="userbutton_div mobile-only">
                    {state.isAuthenticated ? (
                        <Userbutton userId={userId} userFirstname={userFirstname} userLastname={userLastname}/>
                    ) : (
                        <button className="sign_in_button" onClick={() => setIsModalOpen(true)}>
                            Sign In
                        </button>
                    )}
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="hamburger mobile-only" onClick={() => setIsSidebarOpen(true)} aria-label="Open navigation menu">
                    &#9776;
                </div>

            </nav>

            {/* Sidebar for Mobile */}
            <div className={`sidebar ${isSidebarOpen ? 'sidebar_open' : ''}`}>
                {/* Close Icon */}
                <div className="close_icon" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation menu">
                    &times;
                </div>

                {/* Navigation Links */}
                <ul className="sidebar_links">
                    {menuItems.map((item, index) => (
                        <li
                            className="sidebar_item"
                            key={index}
                            onClick={() => {
                                if (userData) {
                                    navigate(item.route);
                                    setIsSidebarOpen(false);
                                }
                            }}
                        >
                            {item.title}
                            {!userData && (
                                <div className="sidebar_dropdown">
                                    <p>{item.description}</p>
                                    <button onClick={() => { setIsSidebarOpen(false); setIsModalOpen(true); }}>{item.buttonText}</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Userbutton for Mobile */}



            </div>
           

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal"
                overlayClassName="modal_overlay"
                ariaHideApp={false} // Add this line if you encounter accessibility issues
            >
                <div className="modal_header">
                    <h2>Sign In or Create Account</h2>
                    <button className="close_button" onClick={() => setIsModalOpen(false)} aria-label="Close modal">&times;</button>
                </div>
                <div className="modal_body">
                    <div className="social_buttons">
                        <button className="social_button google_button">
                            {/* Google SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="20" height="20">
                                <path d="M23 8.9a12.75 12.75 0 0 1 8.9 3.4L38.37 6A22.1 22.1 0 0 0 23 0 23 23 0 0 0 2.45 12.68l7.44 5.78A13.9 13.9 0 0 1 23 8.9z" fill="#ea4335"></path>
                                <path d="M45.08 23.5a19.7 19.7 0 0 0-.5-4.7H23v8.55h12.68A11.24 11.24 0 0 1 31 34.8l7.26 5.63c4.34-4 6.85-9.92 6.85-16.92z" fill="#4285f4"></path>
                                <path d="M9.92 27.55A14.16 14.16 0 0 1 9.15 23a14.88 14.88 0 0 1 .74-4.55l-7.45-5.77a23 23 0 0 0 0 20.65l7.46-5.78z" fill="#fbbc05"></path>
                                <path d="M23 46a21.92 21.92 0 0 0 15.23-5.57L31 34.8a13.6 13.6 0 0 1-8 2.3 13.85 13.85 0 0 1-13.08-9.55l-7.44 5.77A22.94 22.94 0 0 0 23 46z" fill="#34a853"></path>
                                <path d="M0 0h46v46H0V0z" fill="none"></path>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                        <button className="social_button facebook_button">
                            {/* Facebook SVG */}
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12Z" fill="#1877F2"></path>
                            </svg>
                            <span>Continue with Facebook</span>
                        </button>
                        <button className="social_button linkedin_button">
                            {/* LinkedIn SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 46 46">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                                <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                            <span>Continue with LinkedIn</span>
                        </button>
                    </div>
                    <div className="or_separator">
                        <div className="line"></div>
                        <div className="or_text">or</div>
                        <div className="line"></div>
                    </div>
                    <form className="modal_form">
                        <input
                            type="email"
                            className="modal_input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="modal_continue_button" onClick={emailCheck}>Continue</button>
                    </form>
                </div>
            </Modal>

            {/* Sign In Modal */}
            <Modal
                isOpen={isSignInModalOpen}
                onRequestClose={() => setIsSignInModalOpen(false)}
                className="modal"
                overlayClassName="modal_overlay"
                ariaHideApp={false}
            >
                <div className="modal_header">
                    <h2>Welcome Back to OpportuNest</h2>
                    <button className="close_button" onClick={() => setIsSignInModalOpen(false)} aria-label="Close modal">&times;</button>
                </div>
                <div className="modal_body">
                    <form className="modal_form">
                        <input
                            type={inputType}
                            className="modal_input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="checkbox_container">
                            <input
                                type="checkbox"
                                id="showPasswordSignIn"
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPasswordSignIn">Show password</label>
                        </div>
                        <button type="submit" className="modal_continue_button" onClick={passwordCheck}>Sign In</button>
                    </form>
                </div>
            </Modal>

            {/* Register Modal */}
            <Modal
                isOpen={isRegisterModalOpen}
                onRequestClose={() => setIsRegisterModalOpen(false)}
                className="modal"
                overlayClassName="modal_overlay"
                ariaHideApp={false}
            >
                <div className="modal_header">
                    <h2>Welcome to OpportuNest</h2>
                    <button className="close_button" onClick={() => setIsRegisterModalOpen(false)} aria-label="Close modal">&times;</button>
                </div>
                <div className="modal_body">
                    <form className="modal_form">
                        <input
                            type="password"
                            className="modal_input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="checkbox_container">
                            <input
                                type="checkbox"
                                id="showPasswordRegister"
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPasswordRegister">Show password</label>
                        </div>
                        <button type="submit" className="modal_continue_button" onClick={registerUser}>Create Account</button>
                    </form>
                </div>
            </Modal>
        </>
    );

};

export default Nav;
