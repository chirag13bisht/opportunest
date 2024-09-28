import React, { useState, useEffect, useContext } from 'react';
import Model from 'react-modal';
import './Nav.css';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { checkCookie } from '../../Utils/Cookie';
import Userbutton from '../Userbutton/Userbutton';
import axios from 'axios'; // Import axios

const Nav = () => {
    const [visible, setvisible] = useState(false);
    const [visibleM2, setvisibleM2] = useState(false);
    const [visibleM3, setvisibleM3] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [userData, setuserData] = useState();
    const [showDropdown, setShowDropdown] = useState(null);
    const [userId,setuserId]=useState("");
    const [userFirstname,setuserFirstname]=useState("");
    const [userLastname,setuserLastname]=useState("");
    

    const menuItems = [
        {
            title: "Community",
            description: "Your work people are here. Connect anonymously with professionals about work, pay, life, and more.",
            buttonText: "Start using Opportunest",
            route: "/community"
        },
        {
            title: "Jobs",
            description: "Millions of jobs. Search by what matters to you and find the one that's right for you.",
            buttonText: "Start using Opportunest",
            route: "/jobs"
        },
        {
            title: "Companies",
            description: "Are you paid fairly? Get a free, personalised salary estimate and compare with millions of salaries.",
            buttonText: "Start using Opportunest",
            route: "/companies"
        },
        {
            title: "My Circle",
            description: "Review your career growth. Get a free, personalized career review and compare your growth with others.",
            buttonText: "Start using Opportunest",
            route: "/mycircle"
        }
    ];

    useEffect(() => {
        const cookieExists = checkCookie('jwtoken');
        console.log('Cookie exists:', cookieExists); // Debugging log

        if (!cookieExists) {
            navigate('/'); // Redirect to home page if cookie is not present
        }
    }, [navigate]);

    const handleResize = () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const emailCheck = async (e) => {
        e.preventDefault();

        if (!email) {
            window.alert("Please fill in email ");
            return; // Exit the function early
        }

        try {
            const res = await axios.post('https://opportunest-1.onrender.com/api/auth/emailCheck', { email });

            if (res.status === 400 || !res.data) {
                setvisible(false);
                setvisibleM3(true);
                window.alert("Invalid credentials");
            } else {
                dispatch({ type: "USER", payload: true });
                setvisible(false);
                setvisibleM2(true);
                window.alert("Email Found");
            }
        } catch (error) {
            console.error(error);
            window.alert("Error checking email");
        }
    };

    const passwordCheck = async (e) => {
        e.preventDefault();

        if (!password) {
            window.alert("Please fill in password ");
            return; // Exit the function early
        }

        try {
            const res = await axios.post('https://opportunest-1.onrender.com/api/auth/logup', { email, password }, { withCredentials: true });

            if (res.status === 400 || !res.data) {
                window.alert("Incorrect password");
            } else {
                dispatch({ type: "USER", payload: true });
                window.alert("User logged in");
                setvisibleM2(false);
                navigate("/community");
            }
        } catch (error) {
            console.error(error);
            window.alert("Error logging in");
        }
    };

    const handlePassword = () => {
        setType(type === 'password' ? 'text' : 'password');
    };

    const PostData = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('https://opportunest-1.onrender.com/api/auth/signin', { email, password });

            if (res.status === 422 || !res.data) {
                window.alert("Invalid registration");
                console.log("Invalid registration");
            } else {
                window.alert("Successful registration");
                console.log("Successful registration");
                setvisibleM3(false);
                setvisibleM2(true);
            }
        } catch (error) {
            console.error(error);
            window.alert("Error during registration");
        }
    };

    const callAbout = async () => {
        try {
            const res = await axios.get('https://opportunest-1.onrender.com/api/auth/user', { withCredentials: true });

            if (res.status === 401) {
                setuserData(null);
                console.log("User is unauthorized or logged out");
                return;
            }
            setuserId(res.data._id);
            setuserFirstname(res.data.basicdata[0].firstname);
            setuserLastname(res.data.basicdata[0].lastname);
            setuserData(res.data);

            if (res.status !== 200) {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.log(error);
            setuserData(null);
        }
    };

    useEffect(() => {
        callAbout();
    }, [userData]);


    return (
        <>
            <div className='nav_content'>
                <div className='logo_div'>
                    <h1 className='logo_name'>OpportuNest</h1>
                </div>
                <div className={menuOpen ? 'bar' : 'hamburger'} onClick={() => setMenuOpen(!menuOpen)}>=</div>

                {menuOpen && (
                    <div className='close_menu' onClick={() => setMenuOpen(false)}>
                        X
                    </div>
                )}

                <div className={`list_div ${menuOpen ? 'open' : ''}`}>
                    <ul className='list'>
                        {menuItems.map((item, index) => (
                            <li
                                className='community'
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
                                    <div className='dropdown-nav'>
                                        <div>
                                            <h4>{item.description}</h4>
                                        </div>
                                        <div className="styles__sharedStyles__uiKitButton" id="community-dropdown-container">
                                            <button
                                                className="button__button-module__Button button-base__button-base-module__Button"
                                                type="button"
                                                onClick={() => { setvisible(true); }}
                                            >
                                                <span className="button__button-module__ButtonContent">{item.buttonText}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className='nav_signin_div'>
                        {userData ? (
                            <Userbutton userId={userId} userFirstname={userFirstname} userLastname={userLastname} />
                        ) : (
                            <button className='nav_signin_button' onClick={() => setvisible(true)}>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className='model_div'>
                <Model
                    isOpen={visible}
                    onRequestClose={() => setvisible(false)}
                    className='custom_modal'
                    overlayClassName='custom_overlay'
                >
                    <div className='model_sigin_div'>
                        <h1 className='model_sigin'>Sign In or Create Account</h1>
                    </div>
                    <div className='model_privacy_div'>
                        <p className='model_privacy'>Create an account or sign in. By continuing,
                            you agree to our <a href=''>Terms of Use</a> and acknowledge our <a href=''>Privacy Policy</a>.</p>
                    </div>
                    <div className='all_svg'>
                        <div className='svg_button_div'>
                            <button className='svg_button'> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="20" height="20">
                                    <path d="M23 8.9a12.75 12.75 0 0 1 8.9 3.4L38.37 6A22.1 22.1 0 0 0 23 0 23 23 0 0 0 2.45 12.68l7.44 5.78A13.9 13.9 0 0 1 23 8.9z" fill="#ea4335"></path>
                                    <path d="M45.08 23.5a19.7 19.7 0 0 0-.5-4.7H23v8.55h12.68c-.57 3.31-2.21 6.06-4.9 7.88v6.57h7.9c4.63-4.26 7.5-10.61 7.5-17.8z" fill="#4285f4"></path>
                                    <path d="M23 46c5.64 0 10.81-1.92 15-5.16L12.76 36.63C9.36 39.5 6.5 42.74 5 46h18z" fill="#34a853"></path>
                                    <path d="M5 10.1C2.63 12.26 1 15.65 1 19.5c0 3.85 1.58 7.24 4.45 9.75l7.4-5.76A9.51 9.51 0 0 1 5 10.1z" fill="#fbbc05"></path>
                                </svg>
                                <span className='svg_button_text'>Sign in with Google</span>
                            </button>
                        </div>
                        <div className='svg_button_div'>
                            <button className='svg_button'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                    <path fill="#1976d2" d="M23.707 14.293L16 22h11l-3 15 6-8h-11l7-11z"></path>
                                </svg>
                                <span className='svg_button_text'>Sign in with LinkedIn</span>
                            </button>
                        </div>
                    </div>
                    <form className='form_div' method='POST'>
                        <div className='input_div'>
                            <input
                                className='input_box'
                                type='text'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='input_div'>
                            <input
                                className='input_box'
                                type={type}
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className='show_password' onClick={handlePassword}>
                                {type === 'password' ? 'Show' : 'Hide'}
                            </div>
                        </div>
                        <div className='signin_div'>
                            <button className='signin_button' onClick={emailCheck}>Continue</button>
                            <button className='signin_button' onClick={PostData}>Create Account</button>
                        </div>
                    </form>
                </Model>

                <Model
                    isOpen={visibleM2}
                    onRequestClose={() => setvisibleM2(false)}
                    className='custom_modal'
                    overlayClassName='custom_overlay'
                >
                    <h1 className='model_sigin'>Email Found</h1>
                    <div className='input_div'>
                        <h3>Welcome back. Please enter your password to continue:</h3>
                        <input
                            className='input_box'
                            type='text'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='signin_div'>
                        <button className='signin_button' onClick={passwordCheck}>Continue</button>
                    </div>
                </Model>

                <Model
                    isOpen={visibleM3}
                    onRequestClose={() => setvisibleM3(false)}
                    className='custom_modal'
                    overlayClassName='custom_overlay'
                >
                    <h1 className='model_sigin'>Create Account</h1>
                    <div className='input_div'>
                        <input
                            className='input_box'
                            type='text'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input_div'>
                        <input
                            className='input_box'
                            type={type}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='show_password' onClick={handlePassword}>
                            {type === 'password' ? 'Show' : 'Hide'}
                        </div>
                    </div>
                    <div className='signin_div'>
                        <button className='signin_button' onClick={PostData}>Create Account</button>
                    </div>
                </Model>
            </div>
        </>
    );
};

export default Nav;
