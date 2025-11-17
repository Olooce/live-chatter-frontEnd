import React from 'react';
import '../../assets/styles/RoomHeader.css';

const RoomHeader = ({room, onlineUsers}) => {
    return (
        <div className="room-header">
            <div className="room-info">
                <div className="room-title-section">
                    <h1 className="room-title">{room.name}</h1>
                    {room.description && (
                        <p className="room-description">{room.description}</p>
                    )}
                </div>
                <div className="room-meta">
                    <div className="online-indicator">
                        <span className="online-dot"></span>
                        <span className="online-text">
                            {onlineUsers.length} online
                        </span>
                    </div>
                    <span className={`room-type ${room.type}`}>
                        {room.type === 'public' ? '🌐 Public' : '🔒 Private'}
                    </span>
                </div>
            </div>
            <div className="room-actions">
                <button className="room-action-btn" aria-label="Room information">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default RoomHeader;