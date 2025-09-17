import React, { useEffect, useRef } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import ConnectionStatus from "./components/ConnectionStatus";
import "./App.css";

function App() {
  const {
    messages,
    connectionStatus,
    isConnected,
    sendMessage,
    reconnect,
    activeMessageId,
    setActiveMessageId,
  } = useWebSocket("ws://localhost:5000/");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message) => {
    return sendMessage(message);
  };

  const handleReconnect = () => {
    reconnect();
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="chat-icon">💬</span>
            Live Chatter
          </h1>
          <ConnectionStatus
            status={connectionStatus}
            isConnected={isConnected}
            onReconnect={handleReconnect}
          />
        </div>
      </header>

      <main className="chat-main">
        <div className="messages-container">
          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💭</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  isActive={activeMessageId === index}
                  onToggle={() =>
                    setActiveMessageId((prev) =>
                      prev === index ? null : index
                    )
                  }
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <footer className="chat-footer">
        <ChatInput
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
        />
      </footer>
    </div>
  );
}

export default App;