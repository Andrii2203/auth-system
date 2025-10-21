import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error: authError } = useAuth();
    const navigate = useNavigate();


    const validateForm = () => {
        const newErrors = {};


        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }


        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await login(email, password);
            navigate('/welcome');
        } catch (err) {

            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors({ ...errors, password: '' });
        }
    };

  return (
    <div className="login-container">
        <div className="login-card">
            <h1>Login</h1>
            
            <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                    <span className="error-message">{errors.email}</span>
                )}
            </div>


            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                    <span className="error-message">{errors.password}</span>
                )}
            </div>


            {authError && (
                <div className="alert alert-error">
                    {authError}
                </div>
            )}


            <button
                type="submit"
                disabled={isSubmitting}
                className="login-button"
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            </form>


            <p className="register-link">
            Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    </div>
  );
};