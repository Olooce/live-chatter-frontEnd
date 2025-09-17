import { useEffect, useReducer, useCallback } from 'react';

const initialState = {
    messages: [],
    connectionStatus: 'Disconnected',
    isConnected: false,
    ws: null,
    activeMessageId: null,
};

const wsReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECTED':
            return { ...state, connectionStatus: 'Connected', isConnected: true };
        case 'DISCONNECTED':
            return { ...state, connectionStatus: 'Disconnected', isConnected: false };
        case 'ERROR':
            return { ...state, connectionStatus: `Error: ${action.payload}` };
        case 'MESSAGE_RECEIVED':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'WS_INSTANCE':
            return { ...state, ws: action.payload };
        case 'SET_ACTIVE_MESSAGE':
            return { ...state, activeMessageId: action.payload };
        default:
            return state;
    }
};

const useWebSocket = (url) => {
    const [state, dispatch] = useReducer(wsReducer, initialState);

    const connect = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        const wsUrl = token ? `${url}?token=${token}` : url;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            dispatch({ type: 'CONNECTED' });
        };

        ws.onclose = () => {
            dispatch({ type: 'DISCONNECTED' });
        };

        ws.onerror = (error) => {
            dispatch({ type: 'ERROR', payload: error.message || 'WebSocket error' });
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                dispatch({ type: 'MESSAGE_RECEIVED', payload: message });
            } catch (err) {
                console.error('Error parsing WebSocket message:', err, event.data);
            }
        };

        dispatch({ type: 'WS_INSTANCE', payload: ws });

        return ws;
    }, [url]);

    useEffect(() => {
        const ws = connect();

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [connect]);

    const formatMessage = (messageOrString, type = 'chat_message', roomId = '') => {
        if (typeof messageOrString === 'object' && messageOrString !== null) {
            return messageOrString;
        }

        if (typeof messageOrString === 'string') {
            return {
                type: type,
                content: messageOrString,
                room_id: roomId
            };
        }

        throw new Error('Invalid message format');
    };

    const sendMessage = useCallback((message, type = 'chat_message', roomId = '') => {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
            try {
                const formattedMessage = formatMessage(message, type, roomId);
                state.ws.send(JSON.stringify(formattedMessage));
                return true;
            } catch (err) {
                console.error('Error sending message:', err);
                return false;
            }
        }
        return false;
    }, [state.ws]);

    const sendChatMessage = useCallback((content, roomId = '') => {
        return sendMessage({
            type: 'chat_message',
            content: content,
            room_id: roomId
        });
    }, [sendMessage]);

    const joinRoom = useCallback((roomId) => {
        return sendMessage({
            type: 'join_room',
            room_id: roomId
        });
    }, [sendMessage]);

    const leaveRoom = useCallback((roomId) => {
        return sendMessage({
            type: 'leave_room',
            room_id: roomId
        });
    }, [sendMessage]);

    const sendPrivateMessage = useCallback((content, recipientUsername) => {
        return sendMessage({
            type: 'private_message',
            content: content,
            recipient_username: recipientUsername
        });
    }, [sendMessage]);

    const sendTyping = useCallback((isTyping, roomId = '') => {
        return sendMessage({
            type: 'typing',
            content: isTyping ? 'start' : 'stop',
            room_id: roomId
        });
    }, [sendMessage]);

    const ping = useCallback(() => {
        return sendMessage({
            type: 'ping'
        });
    }, [sendMessage]);

    const setActiveMessageId = useCallback((id) => {
        dispatch({ type: 'SET_ACTIVE_MESSAGE', payload: id });
    }, []);

    const reconnect = useCallback(() => {
        if (state.ws) {
            state.ws.close();
        }
        const newWs = connect();
        dispatch({ type: 'WS_INSTANCE', payload: newWs });
    }, [connect, state.ws]);

    return {
        messages: state.messages,
        connectionStatus: state.connectionStatus,
        isConnected: state.isConnected,
        sendMessage,
        sendChatMessage,
        joinRoom,
        leaveRoom,
        sendPrivateMessage,
        sendTyping,
        ping,
        reconnect,
        activeMessageId: state.activeMessageId,
        setActiveMessageId,
    };
};

export default useWebSocket;