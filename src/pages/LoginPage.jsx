import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../assets/styles/LoginPage.css';

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-background">
                <div className="login-container">
                    <div className="login-hero">
                        <div className="hero-content">
                            <div className="hero-brand">
                                <div className="hero-icon">
                                    <img src="/icon.png" alt="Chatter" />
                                </div>
                                <h1 className="hero-title">Chatter</h1>
                            </div>
                            <p className="hero-subtitle">
                                Connect with friends and communities in real-time.
                                Join the conversation and stay connected wherever you are.
                            </p>
                            <div className="hero-features">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </div>
                                    <span>Real-time messaging</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        </svg>
                                    </div>
                                    <span>Secure & private</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                    </div>
                                    <span>Multiple rooms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="login-form-section">
                        <div className="form-container">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;