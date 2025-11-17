import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAuthPayload } from '../../utilities/auth_utils.js';
import '../../assets/styles/LoginForm.css';

const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const payload = await createAuthPayload(
                    credentials.username,
                    credentials.password
                );
                await login(payload);
            } else {
                if (credentials.password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }

                await register(credentials);

                const payload = await createAuthPayload(
                    credentials.username,
                    credentials.password
                );
                await login(payload);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        if (isLogin) {
            return credentials.username.trim() && credentials.password.trim();
        } else {
            return (
                credentials.username.trim() &&
                credentials.password.trim() &&
                credentials.password.length >= 6
            );
        }
    };

    return (
        <div className="login-form-container">
            <div className="form-header">
                <div className="form-icon">
                    {isLogin ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <path d="M20 8v6M23 11h-6"/>
                        </svg>
                    )}
                </div>
                <h2>{isLogin ? 'Welcome Back' : 'Join Chatter'}</h2>
                <p className="form-subtitle">
                    {isLogin ? 'Sign in to continue your conversations' : 'Create your account to get started'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                {error && (
                    <div className="error-message">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4M12 16h.01"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your username"
                        required
                        disabled={loading}
                    />
                </div>

                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email <span className="optional">(optional)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                    />
                    {!isLogin && (
                        <div className="password-hint">
                            Password must be at least 6 characters long
                        </div>
                    )}
                </div>

                {!isLogin && (
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name" className="form-label">
                                First Name <span className="optional">(optional)</span>
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={credentials.first_name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="First name"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name" className="form-label">
                                Last Name <span className="optional">(optional)</span>
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={credentials.last_name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Last name"
                                disabled={loading}
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                    disabled={!isFormValid() || loading}
                >
                    {loading ? (
                        <>
                            <div className="button-spinner"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>

                <div className="form-footer">
                    <p className="footer-text">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    </p>
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        disabled={loading}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;