import React, { useEffect, useRef } from "react";
import { useAuth } from "./contexts/AuthContext.jsx";
import useWebSocket from "./hooks/useWebSocket";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import ConnectionStatus from "./components/ConnectionStatus";
import LoginForm from "./components/LoginForm";
import "./App.css";

function ChatApp() {
    const { user, logout } = useAuth();
    const {
        messages,
        connectionStatus,
        isConnected,
        sendMessage,
        reconnect,
        activeMessageId,
        setActiveMessageId,
    } = useWebSocket("ws://localhost:8080/ws");

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (message) => {
        return sendMessage(message);
    };

    const handleReconnect = () => {
        reconnect();
    };

    const getMessageType = (message) => {
        const username = message.username?.toLowerCase();
        if (!username || username === 'system' || username === 'server') {
            return 'system';
        }
        if (message.username === user?.username) {
            return 'own';
        }
        return 'other';
    };

    return (
        <div className="chat-app">
            <header className="chat-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="app-brand">
                            <div className="brand-icon">💬</div>
                            <h1 className="app-title">Chatter</h1>
                        </div>
                        <div className="connection-status-wrapper">
                            <ConnectionStatus
                                status={connectionStatus}
                                isConnected={isConnected}
                                onReconnect={handleReconnect}
                            />
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="user-welcome">
                            Welcome, <span className="username">{user?.username}</span>
                        </div>
                        <button onClick={logout} className="logout-btn">
                            <span className="logout-icon">⎋</span>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="chat-main">
                <div className="messages-container" ref={messagesContainerRef}>
                    <div className="messages-list">
                        {messages.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💭</div>
                                <h3>No messages yet</h3>
                                <p>Start the conversation by sending a message below</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => {
                                    const messageType = getMessageType(message);
                                    return (
                                        <Message
                                            key={`${message.id || index}-${message.timestamp || Date.now()}`}
                                            message={message}
                                            isActive={activeMessageId === index}
                                            onToggle={() =>
                                                setActiveMessageId((prev) =>
                                                    prev === index ? null : index
                                                )
                                            }
                                            variant={messageType}
                                            currentUser={user?.username}
                                        />
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </div>
            </main>

            <footer className="chat-footer">
                <div className="footer-content">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        isConnected={isConnected}
                    />
                </div>
            </footer>
        </div>
    );
}

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading Chatter...</p>
            </div>
        );
    }

    return user ? <ChatApp /> : <LoginForm />;
}

export default App;