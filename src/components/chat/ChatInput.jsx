import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isConnected }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && isConnected) {
            const success = onSendMessage(message.trim());
            if (success) {
                setMessage('');
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isConnected ? "Type your message..." : "Not connected"}
                    disabled={!isConnected}
                    className="message-input"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || !isConnected}
                    className="send-button"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default ChatInput;