import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function ChatDisplay({ messages, user }) {
    const [stompClient, setStompClient] = useState(null);
    const showWelcome = messages.length === 0;

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new SockJS('http://localhost:8086/ws');
        const stomp = Stomp.over(socket);

        stomp.connect({}, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(stomp);

            // Subscribe to the messages topic
            stomp.subscribe('/topic/messages', (messageOutput) => {
                const response = JSON.parse(messageOutput.body);
                console.log("Received from server:", response);
                // Here you can handle the incoming message
                // For example, you might want to update your messages state
            });
        });

        // Cleanup on component unmount
        return () => {
            if (stomp) {
                stomp.disconnect();
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    // Function to send messages through WebSocket
    const sendMessage = (maskId, textPrompt) => {
        if (stompClient && stompClient.connected) {
            const message = {
                maskId: maskId,
                textPrompt: textPrompt
            };
            stompClient.send("/app/send", {}, JSON.stringify(message));
            console.log("Message sent:", message);
        } else {
            console.error("WebSocket connection not established");
        }
    };

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
        </div>
    );
}

export default ChatDisplay;