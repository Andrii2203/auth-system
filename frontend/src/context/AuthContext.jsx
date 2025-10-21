import React, { createContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            setLoading(false);
            setIsAuthenticated(false);
            return;
        }

        try {
            setLoading(true);
            const response = await authApi.getCurrentUser();
            setUser(response.user);
            setIsAuthenticated(true);
            setError(null);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApi.login(email, password);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            const errorMessage = err.error || err.details?.[0]?.message || 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApi.register(email, password);
            return response;
        } catch (err) {
            const errorMessage = err.error || err.details?.[0]?.message || 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await authApi.logout();
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
        } catch (err) {
            const errorMessage = err.error || 'Logout failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};