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
    const [userId, setuserId] = useState("");
    const [userFirstname, setuserFirstname] = useState("");
    const [userLastname, setuserLastname] = useState("");


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
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/emailCheck', { email });

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
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/logup', { email, password }, { withCredentials: true });

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
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/signin', { email, password });

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
            const res = await axios.get('https://opportunest-1.vercel.app/api/auth/user', { withCredentials: true });

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
                            <button className='svg_button'> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="20" height="20"><path d="M23 8.9a12.75 12.75 0 0 1 8.9 3.4L38.37 6A22.1 22.1 0 0 0 23 0 23 23 0 0 0 2.45 12.68l7.44 5.78A13.9 13.9 0 0 1 23 8.9z" fill="#ea4335"></path>
                                <path d="M45.08 23.5a19.7 19.7 0 0 0-.5-4.7H23v8.55h12.68A11.24 11.24 0 0 1 31 34.8l7.26 5.63c4.34-4 6.85-9.92 6.85-16.92z" fill="#4285f4"></path><path d="M9.92 27.55A14.16 14.16 0 0 1 9.15 23a14.88 14.88 0 0 1 .74-4.55l-7.45-5.77a23 23 0 0 0 0 20.65l7.46-5.78z" fill="#fbbc05"></path><path d="M23 46a21.92 21.92 0 0 0 15.23-5.57L31 34.8a13.6 13.6 0 0 1-8 2.3 13.85 13.85 0 0 1-13.08-9.55l-7.44 5.77A22.94 22.94 0 0 0 23 46z"
                                    fill="#34a853"></path><path d="M0 0h46v46H0V0z" fill="none"></path></svg>
                                <span className='svg_span'>Continue with Google</span>
                            </button>
                        </div>
                        <div className='svg_button_div'>
                            <button className='svg_button'>
                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12Z" fill="#1877F2"></path></svg>
                                <span className='svg_span'>Continue with Facebook</span>
                            </button>
                        </div>
                        <div className='svg_button_div'>
                            <button className='svg_button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 46 46">
                                    <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                                </svg>
                                <span className='svg_span'>Continue with LinkedIn</span>
                            </button>
                        </div>
                    </div>
                    <div className="orSeparator d-flex align-items-center">
                        <div className="borderTop w-100pct my-std"></div>
                        <div className="orText px-xsm strong">or</div>
                        <div className="borderTop w-100pct my-std"></div>
                    </div>
                    <div className='model_inputs'>
                        <input type='email' className='model_input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className='continue_button2' onClick={emailCheck}>Continue</button>
                    </div>
                    <button onClick={() => setvisible(false)} className='close_button'>X</button>
                </Model>
                <Model
                    isOpen={visibleM2}
                    onRequestClose={() => setvisibleM2(false)}
                    className='custom_modal'
                    overlayClassName='custom_overlay'
                >
                    <div className='model_sigin_div'>
                        <h1 className='model_sigin'>Welcome Back to OpportuNest</h1>
                    </div>
                    <div className='create_span_div'>
                        <span className='create_span'>Sign In your account as <a className='added_email'>{email}</a></span>
                    </div>
                    <div className='different_anchor_div'>
                        <a className='different_anchor' onClick={() => { setvisibleM2(false); setvisible(true); }}>Sign In with different mail</a>
                    </div>
                    <div className='model_inputs'>
                        <input type={type} className='model_input' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        <div className='checkbox_container'>
                            <input type='checkbox' onClick={handlePassword} className='checkbox' />
                            <label>Show password</label>
                        </div>
                        <button className='continue_button' onClick={passwordCheck}>Sign In</button>
                    </div>
                    <button onClick={() => setvisibleM2(false)} className='close_button'>X</button>

                </Model>
                <Model
                    isOpen={visibleM3}
                    onRequestClose={() => setvisibleM3(false)}
                    className='custom_modal'
                    overlayClassName='custom_overlay'
                >
                    <div className='model_sigin_div'>
                        <h1 className='model_sigin'>Welcome to OpportuNest</h1>
                    </div>
                    <div className='create_span_div'>
                        <span className='create_span'>Create your account as <a className='added_email'>{email}</a></span>
                    </div>
                    <div className='different_anchor_div'>
                        <a className='different_anchor' onClick={() => { setvisibleM3(false); setvisible(true); }}>Register with different mail</a>
                    </div>
                    <div className='model_inputs'>
                        <input type={type} className='model_input' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        <div className='checkbox_container'>
                            <input type='checkbox' onClick={handlePassword} className='checkbox' />
                            <label>Show password</label>
                        </div>
                        <button className='continue_button' onClick={PostData}>Create Account</button>
                    </div>
                    <button onClick={() => setvisibleM3(false)} className='close_button'>X</button>


                </Model>
            </div>

        </>
    );
};

export default Nav;
