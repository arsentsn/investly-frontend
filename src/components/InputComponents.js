import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export function InputBox({ onSendMessage }) {
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Connect to WebSocket
        const socket = new SockJS('http://localhost:8086/ws');
        const client = Stomp.over(socket);
        
        client.connect({}, frame => {
            console.log('Connected to WebSocket:', frame);
            setConnected(true);
            setStompClient(client);

            // Subscribe to receive messages
            client.subscribe('/topic/messages', message => {
                const response = JSON.parse(message.body);
                console.log('Received:', response);
                if (onSendMessage) {
                    onSendMessage(response.aiResponse.message);
                }
            });
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [onSendMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && stompClient && connected) {
            stompClient.send("/messages/new", {}, JSON.stringify({
                textPrompt: message
            }));
            setMessage(''); // Clear input after sending
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline in textarea
            handleSubmit(e);
        }
    };

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <textarea
                    className="text-area"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
                    placeholder="Type your message..."
                />
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                >
                     ➤
                </button>
            </div>
        </div>
    );
}