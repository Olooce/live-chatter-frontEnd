import React from 'react';

const Message = ({ message }) => {
    const isSystemMessage = message.type === 'system';

    return (
        <div className={`message ${isSystemMessage ? 'system-message' : 'user-message'}`}>
            {isSystemMessage ? (
                <div className="system-content">
                    <span className="system-indicator">●</span>
                    <span className="content">{message.content}</span>
                </div>
            ) : (
                <div className="user-content">
                    {message.sender && (
                        <span className="sender">{message.sender}:</span>
                    )}
                    <span className="content">{message.content}</span>
                </div>
            )}
            <span className="timestamp">{message.timestamp}</span>
        </div>
    );
};

export default Message;