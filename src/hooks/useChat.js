import {useState, useCallback, useEffect} from 'react';
import { chatService } from '../services/chatService';
import useWebSocket from './useWebSocket';

const useChat = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        messages: wsMessages,
        connectionStatus,
        isConnected,
        sendMessage: sendWsMessage,
        reconnect,
        activeMessageId,
        setActiveMessageId,
    } = useWebSocket('ws://localhost:8080/ws');

    const loadMessages = useCallback(async (params = {}) => {
        if (!roomId) return;
        console.log('Loading messages for room:', roomId);
        
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.getRoomMessages(roomId, params);
            console.log('Loaded messages from server:', response.messages);
            setMessages(response.messages || []);
        } catch (err) {
            console.error('Error loading messages:', err);
            setError(err.response?.data?.error || 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        console.log('Room ID changed to:', roomId);
        if (roomId) {
            console.log('Loading initial messages for room:', roomId);
            loadMessages();
        } else {
            console.log('No room selected, clearing messages');
            setMessages([]);
        }
    }, [roomId, loadMessages]);


    useEffect(() => {
        if (!wsMessages || wsMessages.length === 0 || !roomId) return;

        const message = wsMessages[wsMessages.length - 1];
        console.log('New WebSocket message received:', message);

        if (message.type === 'chat_message' && message.room_id === roomId) {
            setMessages(prevMessages => {

                const messageExists = prevMessages.some(msg => msg.id === message.id);
                if (messageExists) {
                    console.log('Message already exists, skipping:', message.id);
                    return prevMessages;
                }
                console.log('Adding new message to chat:', message);
                return [...prevMessages, message];
            });
        }
    }, [wsMessages, roomId]);

    const searchMessages = useCallback(async (query, limit = 20) => {
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.searchMessages(query, roomId, limit);
            return response.messages || [];
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to search messages');
            return [];
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    const loadOnlineUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.getOnlineUsers();
            setOnlineUsers(response.users || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load online users');
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback((content) => {
        if (!roomId) {
            setError('No room selected');
            return false;
        }

        return sendWsMessage({
            type: 'chat_message',
            content: content,
            room_id: roomId
        });
    }, [roomId, sendWsMessage]);

    const sendTypingIndicator = useCallback((isTyping) => {
        if (!roomId) return false;

        return sendWsMessage({
            type: 'typing',
            content: isTyping ? 'start' : 'stop',
            room_id: roomId
        });
    }, [roomId, sendWsMessage]);

    const addReaction = useCallback(async (messageId, emoji) => {
        try {
            await chatService.addReaction(messageId, emoji);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, reactions: [...(msg.reactions || []), { emoji, userId: 'current' }] }
                    : msg
            ));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add reaction');
        }
    }, []);

    const removeReaction = useCallback(async (messageId, emoji) => {
        try {
            await chatService.removeReaction(messageId, emoji);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? {
                        ...msg,
                        reactions: (msg.reactions || []).filter(r =>
                            !(r.emoji === emoji && r.userId === 'current')
                        )
                    }
                    : msg
            ));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove reaction');
        }
    }, []);

    return {
        messages,
        onlineUsers,
        loading,
        error,
        connectionStatus,
        isConnected,
        activeMessageId,
        setActiveMessageId,
        sendMessage,
        sendTypingIndicator,
        loadMessages,
        searchMessages,
        loadOnlineUsers,
        addReaction,
        removeReaction,
        reconnect
    };
};

export default useChat;