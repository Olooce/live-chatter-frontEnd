import { useState } from "react";

const Message = ({ message, isActive, onToggle, variant = "other", currentUser }) => {
    const [reaction, setReaction] = useState(null);
    const availableEmojis = ["👍", "❤️", "😂", "🔥", "😢", "🎉", "👏", "😮", "🤔", "😎", "🙌", "💯", "🥳", "🤩", "😴"];

    const messageType = (() => {
        if (variant && ['system', 'own', 'other'].includes(variant)) {
            return variant;
        }

        const username = message.username?.toLowerCase();
        if (!username || username === 'system' || username === 'server') {
            return 'system';
        }

        if (message.username === currentUser) {
            return 'own';
        }

        return 'other';
    })();

    const isSystemMessage = messageType === 'system';
    const isOwnMessage = messageType === 'own';

    const handleAddReaction = (emoji) => {
        setReaction(emoji);
        onToggle();
    };

    const handleMessageClick = () => {
        if (!isSystemMessage) {
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

                    {/* Emoji picker */}
                    {isActive && !isSystemMessage && (
                        <div className="emoji-picker">
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
                    )}
                </div>
            )}

            {/* Reactions */}
            {reaction && !isSystemMessage && (
                <div className="reactions">
                    <span className="reaction-emoji">{reaction}</span>
                </div>
            )}
        </div>
    );
};

export default Message;