import React, {useState} from 'react';
import '../../assets/styles/ChatInput.css';

const ChatInput = ({onSendMessage, isConnected}) => {
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
                <div className="input-wrapper">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        disabled={!isConnected}
                        className="message-input"
                        autoComplete="off"
                    />

                    <div className="input-actions">
                        {/*<span className="char-count">*/}
                        {/*    {message.length}/500*/}
                        {/*</span>*/}
                        <button
                            type="submit"
                            disabled={!message.trim() || !isConnected}
                            className="send-button"
                            aria-label="Send message"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;