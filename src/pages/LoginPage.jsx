import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../assets/styles/LoginPage.css';

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-background">
                <div className="login-container-wrapper">
                    <div className="login-hero">
                        <div className="hero-content">
                            <div className="hero-icon">💬</div>
                            <h1 className="hero-title">Welcome to Chatter</h1>
                            <p className="hero-subtitle">
                                Connect with friends and communities in real-time.
                                Join the conversation and stay connected wherever you are.
                            </p>
                            <div className="hero-features">
                                <div className="feature">

                                    <span>Real-time messaging</span>
                                </div>
                                <div className="feature">

                                    <span>Secure & private</span>
                                </div>
                                <div className="feature">

                                    <span>Multiple rooms</span>
                                </div>
                                <div className="feature">

                                    <span>Emoji reactions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="login-form-wrapper">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;