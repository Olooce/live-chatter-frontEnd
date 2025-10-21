import React from 'react';
import '../../assets/styles/RoomHeader.css'

const RoomHeader = ({ room, onlineUsers }) => {
    return (
        <div className="room-header">
            <div className="room-title">
                <h2>{room.name}</h2>
                {room.description && (
                    <p className="room-description">{room.description}</p>
                )}
            </div>
            <div className="room-stats">
        <span className="online-count">
          {onlineUsers.length} online
        </span>
                <span className="room-type-badge">{room.type}</span>
            </div>
        </div>
    );
};

export default RoomHeader;