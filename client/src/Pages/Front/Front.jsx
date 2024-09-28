import React, { useState, useContext } from 'react';
import './Front.css';
import photo from '../../image/photo2.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import Footer from '../../Components/Footer/footer';
import axios from 'axios'; // Import axios

const Front = () => {

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            window.alert("Please fill in both email and password");
            return; // Exit the function early
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/logup', {
                email, 
                password
            }, {
                withCredentials: true, // Allows cookies to be sent/received
            });

            const data = res.data;

            if (res.status === 200 && data) {
                dispatch({ type: "USER", payload: true });
                window.alert("Login successful");
                navigate("/community");
            } else {
                window.alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            window.alert("Invalid credentials");
        }
    }

    return (
        <>
            <section className='section1'>
                <div className='monolog_div'>
                    <img src={photo} alt='logo_photo' />
                </div>
                <div className='title_div'>
                    <div>
                        <h1 className='title'>Your Gateway to New Opportunities</h1>
                    </div>
                    <div className='login_signup'>
                        <div className='privacy_text_div'>
                            <span className='privacy_text'>Create an account or sign in. By continuing, you agree to our <a href=''>Terms of Use</a> and acknowledge our <a href=''>Privacy Policy</a>.</span>
                        </div>
                        <div className='login_input_div'>
                            <input type='email' className='email' placeholder='email or username' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type='password' className='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='login_button_div'>
                            <button className='login_button' onClick={loginUser}>Log In</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className='section2'>
                <div className='what_is_opportunest_div'>
                    <h1 className='what_is_opportunest'>What is OpportuNest?</h1>
                </div>
                <div className='about_opportunest_div'>
                    <p className='about_opportunest'>OpportuNest is a job board and recruitment platform that connects talent with career opportunities, streamlining the hiring process for both job seekers and employers.</p>
                </div>
                <div className='svg_div'>
                    {/* Icons and descriptions */}
                    {/* Keep the SVGs and structure as it was */}
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Front;
