import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import RevenueChart from './Widgets';

function ChatDisplay({ messages, user, onNewMessage }) {
    const [stompClient, setStompClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        if (messages.length > 0 && messages[messages.length - 1].isUser) {
            setIsLoading(true);
        }
    }, [messages]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8086/ws');
        const stomp = Stomp.over(socket);

        stomp.connect({}, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(stomp);

            stomp.subscribe('/topic/messages', (messageOutput) => {
                const response = JSON.parse(messageOutput.body);
                console.log("Received from server:", response);

                // Instead of just getting the message, store the entire response
                setIsLoading(false);

                onNewMessage(prevMessages => [...prevMessages, {
                    text: JSON.stringify(response.aiResponse), // Store the entire AI response as a string
                    isUser: false
                }]);
            });
        });

        return () => {
            if (stomp) {
                stomp.disconnect();
            }
        };
    }, [onNewMessage]);

    return (
        <div className="chat-display">
            {showWelcome ? (
                <div className="welcome-container">
                    <h1 className="welcome-header">Welcome {user}</h1>
                    <p className="welcome-msg">Select a category below and enter your input</p>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                            {message.isUser && <span className="mask">{message.mask}</span>}
                            <p className="text-paragraph">{message.text}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot loading">
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ChatDisplay;