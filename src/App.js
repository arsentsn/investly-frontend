import React, { useState } from 'react';
import { Header } from './components/HeaderComponents';
import { InputBox } from './components/InputComponents';
import ChatDisplay from './components/ChatDisplay';
import WidgetsBar from './components/WidgetsBar';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const user = "User";

    const portfolioData = [
        { month: 'Sep', value: 12500 },
        { month: 'Oct', value: 13100 },
        { month: 'Nov', value: 14200 },
        { month: 'Dec', value: 13800 },
        { month: 'Jan', value: 14000 },
        { month: 'Feb', value: 15231.89 }
    ];

    const handleNewMessage = (text, mask) => {
        setMessages(prevMessages => [...prevMessages, {
            text,
            isUser: true,
            mask
        }]);
    };

    return (
        <div className="App">
            <Header />
            <WidgetsBar portfolioData={portfolioData} />
            <ChatDisplay
                messages={messages}
                user={user}
                onNewMessage={setMessages}
            />
            <InputBox onSendMessage={handleNewMessage} />
        </div>
    );
}

export default App;