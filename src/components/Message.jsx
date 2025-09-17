import { useState } from "react";

const Message = ({ message, isActive, onToggle }) => {
  const [reaction, setReaction] = useState(null);

  const isSystemMessage = message.type === "system";
const availableEmojis = ["👍", "❤️", "😂", "🔥", "😢", "🎉", "👏", "😮", "🤔", "😎", "🙌", "💯", "🥳", "🤩", "😴"];

  const handleAddReaction = (emoji) => {
    setReaction(emoji);
    onToggle(); 
  };

  return (
    <div
      className={`message ${isSystemMessage ? "system-message" : "user-message"}`}
      onClick={isSystemMessage ? undefined : onToggle}
      onKeyDown={isSystemMessage ? undefined : (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); }
      }}
      role={isSystemMessage ? undefined : "button"}
      tabIndex={isSystemMessage ? -1 : 0}
      style={{ cursor: isSystemMessage ? "default" : "pointer" }}
    >
      {isSystemMessage ? (
        <div className="system-content">
          <span className="system-indicator">●</span>
          <span className="content">{message.content}</span>
        </div>
      ) : (
        <div className="user-content">
          {message.sender && <span className="sender">{message.sender}:</span>}
          <span className="content">{message.content}</span>

          {/* Emoji picker */}
          {isActive && (
            <div className="emoji-picker">
              {availableEmojis.map((emoji) => (
                <span
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddReaction(emoji);
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <span className="timestamp">{message.timestamp}</span>

      {/* Reaction */}
      {reaction && (
        <div className="reactions">
          <span>{reaction}</span>
        </div>
      )}
    </div>
  );
};

export default Message;
