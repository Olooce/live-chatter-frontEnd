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
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="form-subtitle">
                    {isLogin ? 'Sign in to your account to continue' : 'Join Chatter and start connecting'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
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
                    <>
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
                    </>
                )}

                <button
                    type="submit"
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                    disabled={!isFormValid() || loading}
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>

                <div className="form-footer">
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        disabled={loading}
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;