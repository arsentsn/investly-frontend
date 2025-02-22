import React, { useState } from 'react';
import { Header } from './components/HeaderComponents';
import { InputBox } from './components/InputComponents';
import ChatDisplay from './components/ChatDisplay';
import WidgetsBar from './components/WidgetsBar';
import { PriceProvider } from './utils/PriceContext';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const user = "User";

    const handleNewMessage = (text, mask) => {
        setMessages(prevMessages => [...prevMessages, {
            text,
            isUser: true,
            mask
        }]);
    };

    return (
        <PriceProvider>
            <div className="App">
                <Header />
                <WidgetsBar />
                <ChatDisplay
                    messages={messages}
                    user={user}
                    onNewMessage={setMessages}
                />
                <InputBox onSendMessage={handleNewMessage} />
            </div>
        </PriceProvider>
    );
}

export default App;