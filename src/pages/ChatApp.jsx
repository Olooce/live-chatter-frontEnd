import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
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
    const {user, logout} = useAuth();
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                    if (isMobile) setSidebarOpen(false);
                }
                return;
            }

            const room = await joinRoom(roomId);
            selectRoom(room);
            if (isMobile) setSidebarOpen(false);
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
            if (isMobile) setSidebarOpen(false);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleToggleMessage = (index) => {
        setActiveMessageId(prev => prev === index ? null : index);
    };

    const handleAddReaction = (messageId, emoji) => {
        addReaction(messageId, emoji).then(() => {
        });
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        if (currentRoom?.id) {
            loadMessages().then(() => {
            });
        }
    }, [currentRoom, currentRoom?.id, loadMessages]);

    return (
        <div className="chat-app">
            {isMobile && sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="brand-icon">
                            <img src="/icon.png" alt="Chatter"/>
                        </div>
                        <h1 className="app-title">Chatter</h1>
                    </div>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-section">
                        <div className="section-header">
                            <h3>Rooms</h3>
                            <button
                                className="create-room-btn"
                                onClick={() => setShowCreateRoomModal(true)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Create
                            </button>
                        </div>
                        <RoomList
                            rooms={rooms}
                            userRooms={userRooms}
                            currentRoom={currentRoom}
                            onJoinRoom={handleJoinRoom}
                            onLeaveRoom={handleLeaveRoom}
                            onSelectRoom={(room) => {
                                selectRoom(room);
                                if (isMobile) setSidebarOpen(false);
                            }}
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
                                    <span className="user-avatar">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="username">{user.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <header className="chat-header">
                    <div className="header-content">
                        <div className="header-left">
                            <button
                                className="sidebar-toggle"
                                onClick={toggleSidebar}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 12h18M3 6h18M3 18h18"/>
                                </svg>
                            </button>

                            {currentRoom ? (
                                <RoomHeader room={currentRoom} onlineUsers={onlineUsers}/>
                            ) : (
                                <div className="no-room-selected">
                                    <h2>Select a room to start chatting</h2>
                                </div>
                            )}
                        </div>

                        <div className="header-right">
                            <ConnectionStatus
                                status={connectionStatus}
                                isConnected={isConnected}
                                onReconnect={reconnect}
                            />
                            <div className="user-menu">
                                <div className="user-info">
                                    <span className="user-avatar">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="username">{user?.username}</span>
                                </div>
                                <button onClick={logout} className="logout-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="chat-main">
                    {currentRoom ? (
                        <>
                            <MessageList
                                messages={messages}
                                currentUser={user?.username}
                                activeMessageId={activeMessageId}
                                onToggleMessage={handleToggleMessage}
                                onAddReaction={handleAddReaction}
                                loading={chatLoading}
                            />
                            <footer className="chat-footer">
                                <ChatInput
                                    onSendMessage={handleSendMessage}
                                    isConnected={isConnected}
                                />
                            </footer>
                        </>
                    ) : (
                        <div className="no-room-message">
                            <div className="no-room-content">
                                <div className="welcome-icon">💬</div>
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