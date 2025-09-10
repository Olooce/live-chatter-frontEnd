import React from 'react';

const ConnectionStatus = ({ status, isConnected, onReconnect }) => {
    const getStatusColor = () => {
        if (isConnected) return '#10b981';
        if (status === 'Error') return '#ef4444';
        return '#f59e0b';
    };

    const getStatusIcon = () => {
        if (isConnected) return '●';
        if (status === 'Error') return '●';
        return '●';
    };

    return (
        <div className="connection-status">
            <div className="status-info">
        <span
            className="status-indicator"
            style={{ color: getStatusColor() }}
        >
          {getStatusIcon()}
        </span>
                <span className="status-text">{status}</span>
            </div>
            {!isConnected && status !== 'Connecting...' && (
                <button
                    onClick={onReconnect}
                    className="reconnect-button"
                >
                    Reconnect
                </button>
            )}
        </div>
    );
};

export default ConnectionStatus;