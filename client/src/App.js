// src/App.js

import React, { useEffect, useContext, useReducer, createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Nav from './Components/Navbar/Nav';
import Front from './Pages/Front/Front';
import Community from './Pages/Community/Community';
import Jobs from './Pages/Jobs/Jobs';
import Profile from './Pages/Profile/Profile';
import SavedJobs from './Pages/SavedJobs/SavedJobs';
import Circle from './Pages/Circle/Circle';
import Footer from './Components/Footer/footer';
import axios from './Utils/axiosConfig';
import { initialState, reducer } from './Components/reducer/useReducer';

export const UserContext = createContext();

const AppRoutes = () => {
    const { state } = useContext(UserContext);

    return (
        <Routes>
            <Route path="/" element={<Front />} />
            {state.isAuthenticated && (
                <>
                    <Route path="/community" element={<Community />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<Jobs />} />
                    <Route path="/profile/:userFirstname-userLastname/:userId" element={<Profile />} />
                    <Route path="/savedjobs/:userId" element={<SavedJobs />} />
                    <Route path="/mycircle" element={<Circle />} />
                    {/* Add other protected routes here */}
                </>
            )}
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate(); // Use within BrowserRouter

    useEffect(() => {
        // Function to check authentication status
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/protected', { withCredentials: true });
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

    useEffect(() => {
        // Redirect to /community if authenticated and not already on a protected route
        if (state.isAuthenticated) {
            const currentPath = window.location.pathname;
            const protectedPaths = ['/community', '/jobs', '/profile', '/savedjobs', '/mycircle'];
            const isProtected = protectedPaths.some(path => currentPath.startsWith(path));
            if (!isProtected) {
                navigate('/community');
            }
        }
    }, [state.isAuthenticated, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while checking auth
    }

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <Nav />
            <AppRoutes />
            <Footer />
        </UserContext.Provider>
    );
};

const WrappedApp = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default WrappedApp;
