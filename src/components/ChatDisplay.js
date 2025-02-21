import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function ChatDisplay({ messages, user, onNewMessage }) {
    const [stompClient, setStompClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const showWelcome = messages.length === 0;

    // Ref for auto-scrolling
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

                setIsLoading(false);

                onNewMessage(prevMessages => [...prevMessages, {
                    text: JSON.stringify(response.aiResponse),
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
                    {/* Invisible div to track end of messages */}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
}

export default ChatDisplay;
