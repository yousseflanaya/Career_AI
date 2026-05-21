import axios from 'axios';

// Create an Axios instance configured to communicate with the Laravel backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // The Laravel API URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for Sanctum cookie-based authentication and CORS
});

// Interceptor to attach the Sanctum Token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
