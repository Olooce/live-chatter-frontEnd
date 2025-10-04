import { useState } from "react";

import "../assets/styles/Message.css";

const Message = ({ message, isActive, onToggle, onAddReaction, currentUser }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const availableEmojis = ["👍", "❤️", "😂", "🔥", "😢", "🎉", "👏", "😮", "🤔", "😎", "🙌", "💯", "🥳", "🤩", "😴"];

    const messageType = (() => {
        const username = message.username?.toLowerCase();
        
        if (!username || username === 'system' || username === 'server') {
            return 'system';
        }
        
        return message.username === currentUser ? 'own' : 'other';
    })();

    const isSystemMessage = messageType === 'system';
    const isOwnMessage = messageType === 'own';

    const handleAddReaction = (emoji) => {
        onAddReaction(message.id, emoji);
        setShowEmojiPicker(false);
    };

    const handleMessageClick = () => {
        if (!isSystemMessage) {
            setShowEmojiPicker(!showEmojiPicker);
            onToggle();
        }
    };

    const handleKeyDown = (e) => {
        if (!isSystemMessage && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onToggle();
        }
    };

    return (
        <div
            className={`message ${messageType} ${isActive ? "active" : ""}`}
            onClick={handleMessageClick}
            onKeyDown={handleKeyDown}
            role={isSystemMessage ? undefined : "button"}
            tabIndex={isSystemMessage ? -1 : 0}
            style={{ cursor: isSystemMessage ? "default" : "pointer" }}
            data-message-type={messageType}
            data-username={message.username}
        >
            {isSystemMessage ? (
                <div className="system-content">
                    <span className="system-indicator">●</span>
                    <span className="content">{message.content}</span>
                </div>
            ) : (
                <div className="user-message-bubble">
                    {!isOwnMessage && message.username && (
                        <div className="sender">{message.username}</div>
                    )}

                    <div className="content">{message.content}</div>

                    {message.timestamp && (
                        <div className={`timestamp ${messageType}-timestamp`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}

                    {showEmojiPicker && !isSystemMessage && (
                        <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
                            <div className="emoji-picker-content">
                                {availableEmojis.map((emoji) => (
                                    <span
                                        key={emoji}
                                        className="emoji-option"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddReaction(emoji);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddReaction(emoji);
                                            }
                                        }}
                                    >
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {message.reactions && message.reactions.length > 0 && !isSystemMessage && (
                <div className="reactions">
                    {message.reactions.map((reaction, index) => (
                        <span key={`${reaction.emoji}-${index}`} className="reaction">
                            <span className="reaction-emoji">{reaction.emoji}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Message;