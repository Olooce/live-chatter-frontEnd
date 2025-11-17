import React from 'react';
import "../../assets/styles/RoomList.css"

const RoomList = ({rooms, userRooms, currentRoom, onJoinRoom, onLeaveRoom, onSelectRoom, loading}) => {
    const isUserInRoom = (roomId) => userRooms.some(room => room.id === roomId);

    if (loading) {
        return (
            <div className="room-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading rooms...</p>
            </div>
        );
    }

    return (
        <div className="room-list">
            <div className="rooms-container">
                {rooms.map(room => {
                    const isJoined = isUserInRoom(room.id);
                    const isActive = currentRoom?.id === room.id;

                    return (
                        <div
                            key={room.id}
                            className={`room-item ${isActive ? 'active' : ''} ${isJoined ? 'joined' : ''}`}
                            onClick={() => {
                                if (isJoined) {
                                    onSelectRoom(room);
                                }
                            }}
                        >
                            <div className="room-info">
                                <div className="room-header">
                                    <div className="room-name">{room.name}</div>
                                    <div className="room-meta">
                                        <span className="room-members">
                                            👥 {room.member_count || 0}
                                        </span>
                                        <span className={`room-type ${room.type}`}>
                                            {room.type}
                                        </span>
                                    </div>
                                </div>
                                {room.description && (
                                    <div className="room-description">{room.description}</div>
                                )}
                            </div>

                            <div className="room-actions">
                                {isJoined ? (
                                    <>
                                        {!isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectRoom(room);
                                                }}
                                                className="select-room-btn"
                                            >
                                                Open
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLeaveRoom(room.id);
                                            }}
                                            className="leave-room-btn"
                                        >
                                            Leave
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onJoinRoom(room.id);
                                        }}
                                        className="join-room-btn"
                                    >
                                        Join
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {rooms.length === 0 && (
                    <div className="empty-rooms">
                        <div className="empty-icon">🏠</div>
                        <p>No rooms available</p>
                        <span>Create the first room to get started!</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomList;