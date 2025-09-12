import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
     const [activeMessageId, setActiveMessageId] = useState(null);

    const connect = useCallback(() => {
        try {
            socketRef.current = new WebSocket(url);

            socketRef.current.onopen = (event) => {
                setConnectionStatus('Connected');
                setIsConnected(true);
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: 'The socket connection has been established',
                    timestamp: new Date().toLocaleTimeString()
                }]);
            };

            socketRef.current.onclose = (event) => {
                setConnectionStatus('Disconnected');
                setIsConnected(false);
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: 'The socket connection has been closed',
                    timestamp: new Date().toLocaleTimeString()
                }]);
            };

            socketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setMessages(prev => [...prev, {
                        type: 'message',
                        content: data.content,
                        sender: data.sender,
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('Error');
                setIsConnected(false);
            };

        } catch (error) {
            console.error('Error creating WebSocket:', error);
            setConnectionStatus('Error');
            setIsConnected(false);
        }
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
            return true;
        }
        return false;
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect]);

    return {
        messages,
        connectionStatus,
        isConnected,
        sendMessage,
        disconnect,
        reconnect: connect, 
        activeMessageId, 
        setActiveMessageId
    };
};