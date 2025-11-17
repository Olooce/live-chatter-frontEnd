import React from 'react';
import '../../assets/styles/ConnectionStatus.css';

const ConnectionStatus = ({status, isConnected, onReconnect}) => {
    const getStatusConfig = () => {
        if (isConnected) {
            return {
                color: 'connected',
                text: 'Connected',
                icon: '🟢'
            };
        }
        if (status === 'Error') {
            return {
                color: 'error',
                text: 'Connection Error',
                icon: '🔴'
            };
        }
        return {
            color: 'connecting',
            text: 'Connecting...',
            icon: '🟡'
        };
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="connection-status">
            <div className="status-info">
                <span className={`status-indicator ${statusConfig.color}`}>
                    {statusConfig.icon}
                </span>
                <span className="status-text">{statusConfig.text}</span>
            </div>
            {!isConnected && status !== 'Connecting...' && (
                <button
                    onClick={onReconnect}
                    className="reconnect-button"
                    aria-label="Reconnect"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Retry
                </button>
            )}
        </div>
    );
};

export default ConnectionStatus;