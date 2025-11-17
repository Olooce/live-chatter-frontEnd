import {useCallback, useEffect, useReducer, useRef} from 'react';

const initialState = {
    messages: [],
    connectionStatus: 'Disconnected',
    isConnected: false,
    activeMessageId: null,
};

const wsReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECTING':
            return {...state, connectionStatus: 'Connecting', isConnected: false};
        case 'CONNECTED':
            return {...state, connectionStatus: 'Connected', isConnected: true};
        case 'DISCONNECTED':
            return {...state, connectionStatus: 'Disconnected', isConnected: false};
        case 'ERROR':
            return {...state, connectionStatus: `Error: ${action.payload}`, isConnected: false};
        case 'MESSAGE_RECEIVED':
            return {...state, messages: [...state.messages, action.payload]};
        case 'SET_ACTIVE_MESSAGE':
            return {...state, activeMessageId: action.payload};
        case 'CLEAR_MESSAGES':
            return {...state, messages: []};
        default:
            return state;
    }
};

const useWebSocket = (url) => {
    const [state, dispatch] = useReducer(wsReducer, initialState);
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const shouldReconnectRef = useRef(true);
    const lastConnectTimeRef = useRef(0);
    const reconnectAttemptRef = useRef(0);

    const cleanup = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.onopen = null;
            wsRef.current.onclose = null;
            wsRef.current.onerror = null;
            wsRef.current.onmessage = null;

            if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close(1000, 'Cleanup');
            }
            wsRef.current = null;
        }
    }, []);

    const connect = useCallback(() => {

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        const now = Date.now();
        if (now - lastConnectTimeRef.current < 2000) {
            console.log('Too soon to reconnect, skipping.');
            return;
        }

        cleanup();

        console.log('Initiating WebSocket connection...');
        dispatch({type: 'CONNECTING'});
        lastConnectTimeRef.current = now;

        const token = localStorage.getItem('accessToken');
        const wsUrl = token ? `${url}?token=${token}` : url;

        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connected');
                dispatch({type: 'CONNECTED'});
                reconnectAttemptRef.current = 0;
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code);
                dispatch({type: 'DISCONNECTED'});

                if (shouldReconnectRef.current && event.code !== 1000) {
                    const backoff = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
                    console.log(`Reconnecting in ${backoff}ms`);

                    reconnectTimerRef.current = setTimeout(() => {
                        reconnectAttemptRef.current += 1;
                        connect();
                    }, backoff);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                dispatch({type: 'ERROR', payload: 'Connection failed'});
            };

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    console.log('Received message:', msg);
                    dispatch({type: 'MESSAGE_RECEIVED', payload: msg});
                } catch (e) {
                    console.error('Invalid WS message:', e);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            dispatch({type: 'ERROR', payload: 'Failed to connect'});
        }
    }, [url, cleanup]);

    useEffect(() => {
        shouldReconnectRef.current = true;
        connect();

        return () => {
            console.log('Cleaning up WebSocket...');
            shouldReconnectRef.current = false;
            cleanup();
        };
    }, [connect, cleanup]);

    const formatMessage = (msg, type = 'chat_message', roomId = '') => {
        if (typeof msg === 'object' && msg !== null) return msg;
        if (typeof msg === 'string') {
            return {type, content: msg, room_id: roomId};
        }
        throw new Error('Invalid message format');
    };

    const sendMessage = useCallback((message, type = 'chat_message', roomId = '') => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                const formatted = formatMessage(message, type, roomId);
                wsRef.current.send(JSON.stringify(formatted));
                return true;
            } catch (err) {
                console.error('Error sending message:', err);
                return false;
            }
        }
        console.warn('WebSocket not connected, message not sent');
        return false;
    }, []);

    const reconnect = useCallback(() => {
        reconnectAttemptRef.current = 0;
        connect();
    }, [connect]);

    const clearMessages = useCallback(() => {
        dispatch({type: 'CLEAR_MESSAGES'});
    }, []);

    return {
        messages: state.messages,
        connectionStatus: state.connectionStatus,
        isConnected: state.isConnected,
        sendMessage,
        reconnect,
        clearMessages,
        activeMessageId: state.activeMessageId,
        setActiveMessageId: (id) => dispatch({type: 'SET_ACTIVE_MESSAGE', payload: id}),
    };
};

export default useWebSocket;