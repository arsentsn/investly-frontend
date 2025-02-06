import React from 'react';

function ChatDisplay({ messages }) {
    return (
        <div className="chat-display">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                    {message.isUser && <span className="category">{message.category}</span>}
                    <p className="text-paragraph">{message.text}</p>
                </div>
            ))}
        </div>
    );
}

export default ChatDisplay;