// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://opportunest-1.vercel.app', // Adjust based on your backend server's URL
    withCredentials: true, // Ensures cookies are sent with requests
});

export default axiosInstance;