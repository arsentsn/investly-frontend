import React from 'react';

function ChatDisplay({ messages, user }) {
    const showWelcome = messages.length === 0;

    return (
        <div className="chat-display">
            {showWelcome ? (
                <div className="welcome-container">
                    <h1 className="welcome-header">Welcome {user}</h1>
                    <p className="welcome-msg">Select a category below and enter your input</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                        {message.isUser && <span className="category">{message.category}</span>}
                        <p className="text-paragraph">{message.text}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default ChatDisplay;