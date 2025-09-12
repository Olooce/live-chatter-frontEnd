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
      onClick={onToggle}
      style={{ cursor: "pointer" }}
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
