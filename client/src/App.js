import React, { useEffect, useContext, useReducer, createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './Components/Navbar/Nav';
import Front from './Pages/Front/Front';
import Community from './Pages/Community/Community';
import Jobs from './Pages/Jobs/Jobs';
import Profile from './Pages/Profile/Profile';
import SavedJobs from './Pages/SavedJobs/SavedJobs';
import Circle from './Pages/Circle/Circle';
import axios from './Utils/axiosConfig';
import { initialState, reducer } from './Components/reducer/useReducer';

export const UserContext = createContext();

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Function to check authentication status
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/protected', { withCredentials: true }); // Adjust the endpoint as needed
                if (res.status === 200) {
                    dispatch({ type: 'USER', payload: { isAuthenticated: true, user: res.data.user } });
                }
            } catch (error) {
                dispatch({ type: 'USER', payload: { isAuthenticated: false, user: null } });
            } finally {
                setLoading(false); // Stop loading once authentication is complete
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>; // Show loading spinner or message while checking auth
    }

    return (
        <BrowserRouter>
            <UserContext.Provider value={{ state, dispatch }}>
                <Nav />
                <Routes>
                    <Route path="/" element={<Front />} />
                    {state.isAuthenticated ? ( // Check if the user is authenticated
                        <>
                            <Route path="/community" element={<Community />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<Jobs />} />
                            <Route path="/profile/:userFirstname-userLastname/:userId" element={<Profile />} />
                            <Route path="/savedjobs/:userId" element={<SavedJobs />} />
                            <Route path="/mycircle" element={<Circle />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/" />} />
                    )}
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    );
};

export default App;
