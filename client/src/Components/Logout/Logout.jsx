import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Logout.css';

const Logout = () => {
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const logoutUser = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.get('https://opportunest-1.vercel.app/api/auth/logout', {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true // Enable sending cookies with requests
            });

            if (res.status === 200) {
                dispatch({ type: "USER", payload: false });
                window.alert("Logout successful");
                
                navigate("/");
            } else {
                window.alert("Logout error");
                console.log("error");
            }
        } catch (error) {
            window.alert("Error logging out");
            console.log("Error:", error);
        }
    };

    return (
        <>
            <button onClick={logoutUser} className='logout-button'>
                <span>Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                </svg>
            </button>
        </>
    );
}

export default Logout;
