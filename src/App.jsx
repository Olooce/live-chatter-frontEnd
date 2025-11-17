import React from 'react';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import ChatApp from './pages/ChatApp';
import LoginPage from './pages/LoginPage';
import './App.css';

function AppContent() {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading Chatter...</p>
            </div>
        );
    }

    return user ? <ChatApp/> : <LoginPage/>;
}

function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    );
}

export default App;