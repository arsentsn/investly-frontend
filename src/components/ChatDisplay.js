import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import RevenueChart from './widgets';

function ChatDisplay({ messages, user, onNewMessage }) {
    const [stompClient, setStompClient] = useState(null);
    const showWelcome = messages.length === 0;

    const portfolioData = [
        { month: 'Sep', value: 12500 },
        { month: 'Oct', value: 13100 },
        { month: 'Nov', value: 14200 },
        { month: 'Dec', value: 13800 },
        { month: 'Jan', value: 14000 },
        { month: 'Feb', value: 15231.89 }
    ];

    
    useEffect(() => {
        const socket = new SockJS('http://localhost:8086/ws');
        const stomp = Stomp.over(socket);

        stomp.connect({}, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(stomp);

            // Subscribe to receive messages
            stomp.subscribe('/topic/messages', (messageOutput) => {
                const response = JSON.parse(messageOutput.body);
                console.log("Received from server:", response);
                
                const aiMessageContent = JSON.parse(response.aiResponse.message);
            
                // Add AI response to messages
                onNewMessage(prevMessages => [...prevMessages, {
                    text: aiMessageContent.response,
                    isUser: false
                }]);
            });
        });

        return () => {
            if (stomp) {
                stomp.disconnect();
            }
        };
    }, [onNewMessage]); // Empty dependency array means this runs once on mount

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
                        {message.isUser && <span className="mask">{message.mask}</span>}
                        <p className="text-paragraph">{message.text}</p>
                    </div>
                ))
            )}
             <RevenueChart data={portfolioData} />
        </div>
    );
}

export default ChatDisplay;