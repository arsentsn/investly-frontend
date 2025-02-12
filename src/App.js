import React, { useState } from 'react';
import { Header } from './components/HeaderComponents';
import { InputBox } from './components/InputComponents';
import ChatDisplay from './components/ChatDisplay';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const user = "User";

    const handleNewMessage = (text, mask) => {
        // Add user message to the chat
        setMessages(prevMessages => [...prevMessages, {
            text,
            isUser: true,
            mask
        }]);

        // The WebSocket connection and message sending is now handled in ChatDisplay
    };

    return (
        <div className="App">
            <Header />
            <ChatDisplay
                messages={messages}
                user={user}
                onNewMessage={setMessages} // Pass setMessages to handle incoming WebSocket messages
            />
            <InputBox onSendMessage={handleNewMessage} />
        </div>
    );
}

export default App;