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
                    <h1 className="app-title">
                        <span className="chat-icon">💬</span>
                        Chatter
                    </h1>
                    <div className="user-info">
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                    <ConnectionStatus
                        status={connectionStatus}
                        isConnected={isConnected}
                        onReconnect={handleReconnect}
                    />
                </div>
            </header>

            <main className="chat-main">
                <div className="messages-container">
                    <div className="messages-list">
                        {messages.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💭</div>
                                <p>No messages yet. Start the conversation!</p>
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
                <ChatInput
                    onSendMessage={handleSendMessage}
                    isConnected={isConnected}
                />
            </footer>
        </div>
    );
}

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return user ? <ChatApp /> : <LoginForm />;
}

export default App;