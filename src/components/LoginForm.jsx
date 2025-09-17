import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createAuthPayload } from '../utilities/auth_utils.js';

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
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                // Create hashed payload
                const payload = await createAuthPayload(
                    credentials.username,
                    credentials.password
                );

                await login(payload);
            } else {
                await register(credentials);

                const payload = await createAuthPayload(
                    credentials.username,
                    credentials.password
                );

                await login(payload);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="email">Email (optional)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name (optional)</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={credentials.first_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name (optional)</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={credentials.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="submit-btn">
                    {isLogin ? 'Login' : 'Register'}
                </button>

                <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
