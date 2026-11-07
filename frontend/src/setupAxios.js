import axios from 'axios';
import baseUrl from './BaseUrl';

// The API now requires a login token on cart, payment, history and admin calls.
// Attach it once here instead of in every component. Only requests to our own API get it.
axios.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        const url = String(config.url || '');
        if (token && url.startsWith(baseUrl) && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        // Storage can be unavailable (private mode); the request just goes out without a token.
    }
    return config;
});
