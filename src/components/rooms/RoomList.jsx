import React from 'react';
import "../../assets/styles/RoomList.css"

const RoomList = ({ rooms, userRooms, currentRoom, onJoinRoom, onLeaveRoom, onSelectRoom, loading }) => {
    const isUserInRoom = (roomId) => userRooms.some(room => room.id === roomId);

    if (loading) {
        return (
            <div className="room-list loading">
                <div className="loading-spinner"></div>
                <p>Loading rooms...</p>
            </div>
        );
    }

    return (
        <div className="room-list">
            <div className="room-list-header">
                <h3>Chat Rooms</h3>
            </div>

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
                                } else {
                                    onJoinRoom(room.id);
                                }
                            }}
                        >
                            <div className="room-info">
                                <div className="room-name">{room.name}</div>
                                {room.description && (
                                    <div className="room-description">{room.description}</div>
                                )}
                                <div className="room-meta">
                                    <span className="room-type">{room.type}</span>
                                    <span className="room-members">{room.member_count || 0} members</span>
                                </div>
                            </div>

                            <div className="room-actions">
                                {isJoined ? (
                                    <>
                                        <span className="joined-badge">Joined</span>
                                        {!isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectRoom(room);
                                                }}
                                                className="select-room-btn"
                                            >
                                                Select
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
                        <p>No rooms available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomList;