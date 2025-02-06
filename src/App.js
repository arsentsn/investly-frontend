import React, { useState } from 'react';
import { Header } from './components/HeaderComponents';
import { InputBox } from './components/InputComponents';
import ChatDisplay from './components/ChatDisplay';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const user = "User"; // You can replace this with the actual user name or get it from somewhere else

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
      <ChatDisplay messages={messages} user={user} />
      <InputBox onSendMessage={handleNewMessage} />
    </div>
  );
}

export default App;