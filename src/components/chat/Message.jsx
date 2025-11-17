import React, {useState} from 'react';
import '../../assets/styles/Message.css';

const Message = ({message, isActive, onToggle, onAddReaction, currentUser}) => {
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
        if (!isSystemMessage && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleMessageClick();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    };

    return (
        <div
            className={`message ${messageType} ${isActive ? 'active' : ''} ${showEmojiPicker ? 'picker-open' : ''}`}
            onClick={handleMessageClick}
            onKeyDown={handleKeyDown}
            role={isSystemMessage ? undefined : 'button'}
            tabIndex={isSystemMessage ? -1 : 0}
            aria-label={isSystemMessage ? undefined : `Message from ${message.username}. Press enter to react.`}
            data-message-type={messageType}
        >
            {isSystemMessage ? (
                <div className="system-message">
                    <div className="system-content">
                        <span className="system-icon">●</span>
                        <span className="system-text">{message.content}</span>
                    </div>
                </div>
            ) : (
                <div className="user-message">
                    {!isOwnMessage && (
                        <div className="message-sender">
                            <span className="sender-avatar">
                                {message.username?.charAt(0).toUpperCase()}
                            </span>
                            <span className="sender-name">{message.username}</span>
                        </div>
                    )}
                    <div className="message-bubble-container">
                        <div className="message-bubble">
                            <div className="message-content">
                                {message.content}
                            </div>
                            <div className="message-timestamp">
                                {formatTime(message.created_at)}
                            </div>
                        </div>

                        {showEmojiPicker && (
                            <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
                                <div className="emoji-picker-content">
                                    {availableEmojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="emoji-option"
                                            onClick={() => handleAddReaction(emoji)}
                                            aria-label={`Add ${emoji} reaction`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="emoji-picker-arrow"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {message.reactions && message.reactions.length > 0 && !isSystemMessage && (
                <div className="message-reactions">
                    {message.reactions.map((reaction, index) => (
                        <button
                            key={`${reaction.emoji}-${index}`}
                            className="reaction-badge"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddReaction(reaction.emoji);
                            }}
                            aria-label={`React with ${reaction.emoji}`}
                        >
                            <span className="reaction-emoji">{reaction.emoji}</span>
                            <span className="reaction-count">{reaction.count || 1}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Message;