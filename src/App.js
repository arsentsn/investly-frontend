import React, { useState } from 'react';
import './App.css';
import { Header } from './components/HeaderComponents';
import { InputBox } from './components/InputComponents';
import ChatDisplay from './components/ChatDisplay';

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (text, category) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true, category }]);
    // Here you would typically send the message to your backend
    // and then add the response to the messages
    // For now, let's just add a mock response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: "This is a mock response", isUser: false }]);
    }, 1000);
  };

  return (
    <div className="App">
      <Header />
      <ChatDisplay messages={messages} />
      <InputBox onSendMessage={handleNewMessage} />
    </div>
  );
}

export default App;