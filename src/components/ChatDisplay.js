import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import TradeHistoryDisplay from '../utils/TradeHistoryDisplay';
import OrderDisplay from '../utils/OrderDisplay';

const formatAIResponse = (messageString) => {
    try {
        // Parse the outer message structure
        const messageObj = typeof messageString === 'string' ? JSON.parse(messageString) : messageString;

        // Parse the inner message JSON string
        const innerMessage = JSON.parse(messageObj.message);

        if (innerMessage.response && innerMessage.order_details) {
            return <OrderDisplay orderData={innerMessage} />;
        }

        // Handle crypto information response
        if (innerMessage.response && innerMessage.current_market_position) {
            return (
                <div className="crypto-info-container p-4 rounded-lg">
                    {/* Main Response */}
                    <div className="mb-6">
                        <p className="text-lg font-medium text-black">{innerMessage.response}</p>
                    </div>

                    {/* Market Position */}
                    <div className="bg-black/5 p-4 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2 text-black">Market Position</h3>
                        <p className="text-gray-800">{innerMessage.current_market_position}</p>
                    </div>

                    {/* Investment Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Investment Considerations */}
                        <div className="bg-black/5 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2 text-black">Investment Considerations</h3>
                            <p className="text-gray-800">{innerMessage.potential_investment_considerations}</p>
                        </div>

                        {/* Historical Performance */}
                        <div className="bg-black/5 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2 text-black">Historical Performance</h3>
                            <p className="text-gray-800">{innerMessage.historical_performance}</p>
                        </div>
                    </div>

                    {/* Risk Factors and Investment Option */}
                    <div className="bg-black/5 p-4 rounded-lg mb-4">
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-black">Risk Factors</h3>
                            <p className="text-gray-800">{innerMessage.risk_factors}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-black">Investment Option</h3>
                            <p className="text-gray-800">{innerMessage.investment_option}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Handle trade history response
        if (innerMessage.trades) {
            return (
                <div className="trade-history">
                    <h3 className="trade-header">Recent Trades</h3>
                    <div className="trades-container">
                        {innerMessage.trades.map((trade, index) => (
                            <TradeHistoryDisplay key={trade.orderId || index} trade={trade} />
                        ))}
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
                        {Object.entries(innerMessage.balances).filter(([_, details]) => parseFloat(details.amount) > 0).map(([symbol, details]) => (
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
                                    <div className="amount-container">
                                        <span className="asset-amount">{details.amount} {symbol}</span>
                                        {details.usd_value && (
                                            <span className="usd-value">${Number(details.usd_value).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {innerMessage.total_value_usd && (
                        <div className="total-value">
                            Total Value: ${Number(innerMessage.total_value_usd).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                        </div>
                    )}
                </div>
            );
        }
        // Handle investment advice response
        if (innerMessage.allocation) {
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

        // For other responses, return the response field or stringified message
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

    const getMessageClass = (message) => {
        let classes = `message ${message.isUser ? 'user' : 'bot'}`;

        if (!message.isUser && message.text) {
            try {
                const messageObj = typeof message.text === 'object' ? message.text : JSON.parse(message.text);
                const innerMessage = JSON.parse(messageObj.message);

                if (innerMessage.balances) {
                    classes += ' balance-message';
                }
            } catch (e) {
                // If parsing fails, just use regular message class
            }
        }

        return classes;
    };

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-display');
        if (chatContainer) {
            if (isLoading) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } else {
                chatContainer.scrollTop += 50;
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
                            className={getMessageClass(message)}
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