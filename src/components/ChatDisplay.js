import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const formatAIResponse = (messageString) => {
    try {
        // Parse the outer message structure
        const messageObj = typeof messageString === 'string' ? JSON.parse(messageString) : messageString;

        // Parse the inner message JSON string
        const innerMessage = JSON.parse(messageObj.message);

        // Handle trade history response
        if (innerMessage.trades) {
            return (
                <div className="trade-history">
                    <h3 className="trade-header">Recent Trades</h3>
                    <div className="trades-container">
                        {innerMessage.trades.map((trade, index) => {
                            const tradeDate = new Date(trade.time);
                            const formattedDate = tradeDate.toLocaleString();
                            const totalValue = (parseFloat(trade.price) * parseFloat(trade.quantity)).toFixed(2);

                            return (
                                <div key={trade.orderId} className="trade-item">
                                    <div className="trade-symbol">
                    <span className={`trade-type ${trade.isBuyer ? 'buy' : 'sell'}`}>
                      {trade.isBuyer ? 'BUY' : 'SELL'}
                    </span>
                                        {trade.symbol}
                                    </div>
                                    <div className="trade-details">
                                        <div className="trade-amount">
                                            <span className="label">Amount:</span>
                                            <span className="value">{parseFloat(trade.quantity).toFixed(4)} {trade.symbol.replace('USDT', '')}</span>
                                        </div>
                                        <div className="trade-price">
                                            <span className="label">Price:</span>
                                            <span className="value">${parseFloat(trade.price).toFixed(2)}</span>
                                        </div>
                                        <div className="trade-total">
                                            <span className="label">Total:</span>
                                            <span className="value">${totalValue}</span>
                                        </div>
                                        <div className="trade-time">
                                            <span className="label">Time:</span>
                                            <span className="value">{formattedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // Handle balance information response
        if (innerMessage.balances) {
            return (
                <div className="balance-info">
                    <h3 className="balance-header">Current Portfolio Balance</h3>
                    <div className="balance-grid">
                        {Object.entries(innerMessage.balances).map(([symbol, details]) => (
                            <div key={symbol} className="balance-item">
                                <img
                                    src={`/crypto-icons/${symbol.toLowerCase()}.svg`}
                                    alt={symbol}
                                    className="crypto-icon"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div className="balance-details">
                                    <span className="asset-name">{details.asset}</span>
                                    <span className="asset-amount">{details.amount} {symbol}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {innerMessage.total_value_usd && (
                        <div className="total-value">
                            Total Value: ${Number(innerMessage.total_value_usd).toLocaleString()}
                        </div>
                    )}
                </div>
            );
        }

        if (innerMessage.allocation) {
            // Format investment advice response
            return (
                <div className="investment-advice">
                    <p className="main-response">{innerMessage.response}</p>
                    <div className="allocation-breakdown">
                        {Object.entries(innerMessage.allocation).map(([asset, details]) => (
                            <div key={asset} className="allocation-item">
                                <strong>{asset}:</strong> {details}
                            </div>
                        ))}
                    </div>
                    {innerMessage.strategy && (
                        <p className="strategy-note">
                            <strong>Strategy:</strong> {innerMessage.strategy}
                        </p>
                    )}
                </div>
            );
        }

        // For non-investment advice responses, just return the response field
        return innerMessage.response || JSON.stringify(innerMessage);
    } catch (e) {
        // If parsing fails, return the original message or a default message
        return messageString?.text || messageString || "Unable to display message";
    }
};

function ChatDisplay({ messages, user, onNewMessage }) {
    const [stompClient, setStompClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const showWelcome = messages.length === 0;
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-display');
        if (chatContainer) {
            // Scroll down by a specific amount (e.g., 50 pixels)
            chatContainer.scrollTop += 50; // Adjust this value as needed

            // If loading, ensure the loading bubble is visible
            if (isLoading) {
                chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
            }
        }
    }, [messages, isLoading]);

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
                    text: response.aiResponse,
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
                        <div
                            key={index}
                            className={`message ${message.isUser ? 'user' : 'bot'}`}
                        >
                            <div className="message-content">
                                {message.isUser ? (
                                    <p className="text-paragraph">{message.text}</p>
                                ) : (
                                    formatAIResponse(message.text)
                                )}
                            </div>
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
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
}

export default ChatDisplay;