import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    register: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/register', {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },

    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });
            // Store token in localStorage for persistence
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
            localStorage.removeItem('authToken');
            return { message: 'Logged out successfully' };
        } catch (error) {
            localStorage.removeItem('authToken');
            throw error.response?.data || { error: 'Logout failed' };
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch user' };
        }
    },
};

export default authApi;