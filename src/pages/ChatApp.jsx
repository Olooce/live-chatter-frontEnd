import React, {useEffect, useState} from 'react';
import { useAuth } from '../contexts/AuthContext';
import useRooms from '../hooks/useRooms';
import useChat from '../hooks/useChat';
import RoomList from '../components/rooms/RoomList';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ConnectionStatus from '../components/chat/ConnectionStatus';
import RoomHeader from '../components/rooms/RoomHeader';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import '../assets/styles/ChatApp.css';

function ChatApp() {
    const { user, logout } = useAuth();
    const {
        rooms,
        userRooms,
        currentRoom,
        loading: roomsLoading,
        createRoom,
        joinRoom,
        leaveRoom,
        selectRoom,
    } = useRooms();

    const {
        messages,
        onlineUsers,
        connectionStatus,
        isConnected,
        loading: chatLoading,
        activeMessageId,
        setActiveMessageId,
        sendMessage,
        addReaction,
        loadMessages,
        reconnect,
    } = useChat(currentRoom?.id);

    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleSendMessage = (message) => {
        return sendMessage(message);
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const isAlreadyInRoom = userRooms.some(room => room.id === roomId);

            if (isAlreadyInRoom) {
                const room = rooms.find(room => room.id === roomId);
                if (room) {
                    selectRoom(room);
                }
                return;
            }

            const room = await joinRoom(roomId);
            selectRoom(room);
        } catch (error) {
            console.error('Failed to join room:', error);
        }
    };

    const handleLeaveRoom = async (roomId) => {
        try {
            await leaveRoom(roomId);
        } catch (error) {
            console.error('Failed to leave room:', error);
        }
    };

    const handleCreateRoom = async (roomData) => {
        try {
            const room = await createRoom(roomData);
            selectRoom(room);
            setShowCreateRoomModal(false);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleToggleMessage = (index) => {
        setActiveMessageId(prev => prev === index ? null : index);
    };

    const handleAddReaction = (messageId, emoji) => {
        addReaction(messageId, emoji).then(() => {});
    };

    useEffect(() => {
        if (currentRoom?.id) {
            console.log('Current room changed:', currentRoom);
            loadMessages().then(() => {});
        }
    }, [currentRoom, currentRoom?.id, loadMessages]);

    useEffect(() => {
        console.log('Messages updated in ChatApp:', messages);
    }, [messages]);

    return (
        <div className="chat-app">
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <button
                        className="app-brand"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        <div className="brand-icon">
                            {sidebarCollapsed ? (
                                <img src="/icon.png"
                                     alt="Chatter Collapsed"
                                     style={{ width: "24px", height: "24px" }}
                                />

                            ) : (
                                <img src="/icon.png"
                                     alt="Chatter Expanded"
                                     style={{ width: "24px", height: "24px" }}
                                />
                            )}
                        </div>
                    </button>
                    {!sidebarCollapsed && <h1 className="app-title">Chatter</h1>}
                </div>

                {!sidebarCollapsed && (
                    <>
                        <div className="sidebar-section">
                            <div className="section-header">
                                <h3>Rooms</h3>
                                <button
                                    className="create-room-btn"
                                    onClick={() => setShowCreateRoomModal(true)}
                                >
                                    +
                                </button>
                            </div>
                            <RoomList
                                rooms={rooms}
                                userRooms={userRooms}
                                currentRoom={currentRoom}
                                onJoinRoom={handleJoinRoom}
                                onLeaveRoom={handleLeaveRoom}
                                onSelectRoom={selectRoom}
                                loading={roomsLoading}
                            />
                        </div>

                        <div className="sidebar-section">
                            <div className="section-header">
                                <h3>Online Users</h3>
                                <span className="online-count">{onlineUsers.length}</span>
                            </div>
                            <div className="online-users">
                                {onlineUsers.map(user => (
                                    <div key={user.id} className="online-user">
                                        <span className="user-status"></span>
                                        <span className="username">{user.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="main-content">
                <header className="chat-header">
                    <div className="header-content">
                        <div className="header-left">
                            {currentRoom ? (
                                <RoomHeader room={currentRoom} onlineUsers={onlineUsers} />
                            ) : (
                                <div className="no-room-selected">
                                    <h2>Select a room to start chatting</h2>
                                </div>
                            )}
                            <div className="connection-status-wrapper">
                                <ConnectionStatus
                                    status={connectionStatus}
                                    isConnected={isConnected}
                                    onReconnect={reconnect}
                                />
                            </div>
                        </div>

                        <div className="header-right">
                            <div className="user-welcome">
                                Welcome, <span className="username">{user?.username}</span>
                            </div>
                            <button onClick={logout} className="logout-btn">
                                <span className="logout-icon">⎋</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <main className="chat-main">
                    {currentRoom ? (
                        <>
                            <div className="messages-container">
                                <MessageList
                                    messages={messages}
                                    currentUser={user?.username}
                                    activeMessageId={activeMessageId}
                                    onToggleMessage={handleToggleMessage}
                                    onAddReaction={handleAddReaction}
                                    loading={chatLoading}
                                />
                            </div>
                            <footer className="chat-footer">
                                <div className="footer-content">
                                    <ChatInput
                                        onSendMessage={handleSendMessage}
                                        isConnected={isConnected}
                                    />
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="no-room-message">
                            <div className="no-room-content">
                                <h2>Welcome to Chatter!</h2>
                                <p>Select a room from the sidebar or create a new one to start chatting.</p>
                                <button
                                    className="create-room-cta"
                                    onClick={() => setShowCreateRoomModal(true)}
                                >
                                    Create Your First Room
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showCreateRoomModal && (
                <CreateRoomModal
                    onCreateRoom={handleCreateRoom}
                    onClose={() => setShowCreateRoomModal(false)}
                />
            )}
        </div>
    );
}

export default ChatApp;