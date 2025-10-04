import React from 'react';

const ConnectionStatus = ({ status, isConnected, onReconnect }) => {
    const getStatusColor = () => {
        if (isConnected) return 'connected';
        if (status === 'Error') return 'error';
        return 'connecting';
    };

    const getStatusText = () => {
        if (isConnected) return 'Connected';
        if (status === 'Error') return 'Connection Error';
        return 'Connecting...';
    };

    return (
        <div className="connection-status">
            <div className="status-info">
                <span
                    className={`status-indicator ${getStatusColor()}`}
                />
                <span className="status-text">{getStatusText()}</span>
            </div>
            {!isConnected && status !== 'Connecting...' && (
                <button
                    onClick={onReconnect}
                    className="reconnect-button"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default ConnectionStatus;