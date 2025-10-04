import { useEffect, useReducer, useCallback } from 'react';

const initialState = {
    messages: [],
    connectionStatus: 'Disconnected',
    isConnected: false,
    ws: null,
    activeMessageId: null,
    reconnectAttempt: 0,
    shouldReconnect: true,
    isConnecting: false,
    lastConnectTime: null
};

const wsReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECTING':
            return {
                ...state,
                isConnecting: true,
                connectionStatus: 'Connecting',
                lastConnectTime: Date.now()
            };
        case 'CONNECTED':
            return { 
                ...state, 
                connectionStatus: 'Connected', 
                isConnected: true,
                isConnecting: false,
                reconnectAttempt: 0 
            };
        case 'DISCONNECTED':
            return { 
                ...state, 
                connectionStatus: 'Disconnected', 
                isConnected: false,
                isConnecting: false,
                ws: null
            };
        case 'ERROR':
            return { 
                ...state, 
                connectionStatus: `Error: ${action.payload}`,
                isConnected: false
            };
        case 'MESSAGE_RECEIVED':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'WS_INSTANCE':
            return { ...state, ws: action.payload };
        case 'SET_ACTIVE_MESSAGE':
            return { ...state, activeMessageId: action.payload };
        case 'INCREMENT_RECONNECT':
            return { ...state, reconnectAttempt: state.reconnectAttempt + 1 };
        case 'SET_SHOULD_RECONNECT':
            return { ...state, shouldReconnect: action.payload };
        default:
            return state;
    }
};

const useWebSocket = (url) => {
    const [state, dispatch] = useReducer(wsReducer, initialState);

    const connect = useCallback(() => {
        // Prevent connection if we're already connecting or connected
        if (state.isConnecting || (state.ws?.readyState === WebSocket.OPEN)) {
            console.log('WebSocket is already connecting or connected...');
            return;
        }

        // Implement connection rate limiting
        const now = Date.now();
        if (state.lastConnectTime && (now - state.lastConnectTime < 5000)) {
            console.log('Connection attempt too soon, waiting...');
            return;
        }

        dispatch({ type: 'CONNECTING' });
        console.log('Initiating WebSocket connection...');
        const token = localStorage.getItem('accessToken');
        const wsUrl = token ? `${url}?token=${token}` : url;
        
        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connected successfully');
                dispatch({ type: 'CONNECTED' });
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                dispatch({ type: 'DISCONNECTED' });
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                dispatch({ type: 'ERROR', payload: error.message || 'WebSocket error' });
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('WebSocket received:', message);
                    dispatch({ type: 'MESSAGE_RECEIVED', payload: message });
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            dispatch({ type: 'WS_INSTANCE', payload: ws });
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            dispatch({ type: 'ERROR', payload: error.message });
        }
    }, [url]);

    const reconnectWithBackoff = useCallback(() => {
        if (!state.shouldReconnect) return;
        
        const backoffTime = Math.min(1000 * Math.pow(2, state.reconnectAttempt), 30000);
        console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${state.reconnectAttempt + 1})`);
        
        setTimeout(() => {
            if (state.shouldReconnect && !state.isConnected) {
                dispatch({ type: 'INCREMENT_RECONNECT' });
                connect();
            }
        }, backoffTime);
    }, [state.reconnectAttempt, state.shouldReconnect, state.isConnected, connect]);

    // Main connection effect
    useEffect(() => {
        if (!state.ws && state.shouldReconnect && !state.isConnecting) {
            connect();
        }

        // Cleanup function for component unmount
        return () => {
            if (state.ws) {
                console.log('Cleaning up WebSocket connection...');
                dispatch({ type: 'SET_SHOULD_RECONNECT', payload: false });
                state.ws.close(1000, 'Component unmounting');
            }
        };
    }, [state.ws, state.shouldReconnect, state.isConnecting, connect]);

    // Handle WebSocket events
    useEffect(() => {
        if (!state.ws) return;

        const ws = state.ws;

        const handleClose = (event) => {
            console.log(`WebSocket closed with code ${event.code} and reason: ${event.reason}`);
            
            // Don't reconnect if the closure was clean (code 1000) or if shouldReconnect is false
            if (event.code === 1000 || !state.shouldReconnect) {
                dispatch({ type: 'DISCONNECTED' });
                return;
            }

            dispatch({ type: 'DISCONNECTED' });
            reconnectWithBackoff();
        };

        ws.addEventListener('close', handleClose);

        return () => {
            ws.removeEventListener('close', handleClose);
        };
    }, [state.ws, reconnectWithBackoff]);

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