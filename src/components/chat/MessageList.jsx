import React, { useEffect, useRef } from 'react';
import Message from '../Message.jsx';
import "../../assets/styles/MessageList.css"

const MessageList = ({
                         messages,
                         currentUser,
                         activeMessageId,
                         onToggleMessage,
                         onAddReaction,
                         loading
                     }) => {
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) {
        return (
            <div className="messages-list loading">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
            </div>
        );
    }

    return (
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
                        {messages.map((message, index) => (
                            <Message
                                key={message.id || `${index}-${message.created_at || ''}`}
                                message={message}
                                isActive={activeMessageId === index}
                                onToggle={() => onToggleMessage(index)}
                                currentUser={currentUser}
                                onAddReaction={onAddReaction}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageList;