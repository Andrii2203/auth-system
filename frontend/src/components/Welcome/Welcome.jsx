import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Welcome.css';

export const Welcome = () => {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

  return (
    <div className="welcome-container">
        <div className="welcome-card">
            <div className="welcome-header">
                <h1>Welcome!</h1>
                <div className="user-avatar">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>

            <div className="user-info">
                <p className="greeting">
                    Hello, <span className="user-email">{user?.email}</span>
                </p>
            </div>

            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="logout-button"
            >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>

            <div className="welcome-info">
                <p>You are successfully authenticated!</p>
                <p>Your session will expire in 30 minutes.</p>
            </div>
        </div>
    </div>
  );
};