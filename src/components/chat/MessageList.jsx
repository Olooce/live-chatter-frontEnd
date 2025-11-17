import React, {useEffect, useRef} from 'react';

import '../../assets/styles/MessageList.css';
import Message from "./Message.jsx";

const MessageList = ({
                         messages,
                         currentUser,
                         activeMessageId,
                         onToggleMessage,
                         onAddReaction,
                         loading
                     }) => {
    const messagesEndRef = useRef(null);
    const messagesListRef = useRef(null);

    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({
            behavior,
            block: 'end'
        });
    };

    useEffect(() => {
        scrollToBottom('auto');
    }, []);

    useEffect(() => {
        const el = messagesListRef.current
        if (!el) return;

        const threshold = 150;
        const atBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

        if (atBottom) {
            scrollToBottom("smooth");
        }
    }, [messages]);


    if (loading) {
        return (
            <div className="messages-list loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-container">
            <div className="messages-list" ref={messagesListRef}>
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>No messages yet</h3>
                        <p>Start the conversation by sending a message below</p>
                    </div>
                ) : (
                    <>
                        <div className="messages-content">
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
                        </div>
                        <div ref={messagesEndRef} className="scroll-anchor"/>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageList;