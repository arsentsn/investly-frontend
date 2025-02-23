import React, { useState, useEffect } from 'react';
import WidgetRenderer from './WidgetRenderer';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import PortfolioChartWidget from "../utils/PortfolioChartWidget";

const WidgetsBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [widgets, setWidgets] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [notifications, setNotifications] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Effect to handle visibility based on widgets
  useEffect(() => {
    setIsVisible(widgets.length > 0);
  }, [widgets]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8086/ws');
    const stomp = Stomp.over(socket);

    stomp.connect({}, (frame) => {
      console.log('Connected to WebSocket:', frame);
      setStompClient(stomp);

      stomp.subscribe('/topic/messages', (messageOutput) => {
        const response = JSON.parse(messageOutput.body);
        console.log("Received message:", response);

        if (response.aiResponse && response.aiResponse.message) {
          try {
            const messageObj = JSON.parse(response.aiResponse.message);
            if (messageObj.widget) {
              const widgetId = Date.now();
              setWidgets(prevWidgets => [...prevWidgets, {
                id: widgetId,
                data: response.aiResponse
              }]);
              setAmounts(prev => ({ ...prev, [widgetId]: '' }));
            }
          } catch (error) {
            console.error('Error parsing widget message:', error);
          }
        }
      });
    });

    return () => {
      if (stomp) {
        stomp.disconnect();
      }
    };
  }, []);

  const showNotification = (widgetId, message) => {
    setNotifications(prev => ({ ...prev, [widgetId]: message }));
    setTimeout(() => {
      setNotifications(prev => {
        const newNotifications = { ...prev };
        delete newNotifications[widgetId];
        return newNotifications;
      });
    }, 3000);
  };

  const removeWidget = (widgetId) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== widgetId));
    setAmounts(prev => {
      const newAmounts = { ...prev };
      delete newAmounts[widgetId];
      return newAmounts;
    });
  };

  const handleAmountChange = (widgetId, value) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setAmounts(prev => ({ ...prev, [widgetId]: value }));
    }
  };

  const sendTradeMessage = (widgetId, amount, asset, isBuy) => {
    if (stompClient && amount) {
      const message = {
        textPrompt: `I want to ${isBuy ? 'buy' : 'sell'} ${amount} euro of ${asset}`
      };
      stompClient.send("/messages/new", {}, JSON.stringify(message));
      showNotification(widgetId, `Request sent: ${isBuy ? 'Buying' : 'Selling'} ${amount} EUR of ${asset}`);
      setAmounts(prev => ({ ...prev, [widgetId]: '' }));
    }
  };

  const handleTrade = (widgetId, asset, isBuy) => {
    const amount = amounts[widgetId];
    if (!amount) {
      showNotification(widgetId, 'Please enter an amount');
      return;
    }
    sendTradeMessage(widgetId, amount, asset, isBuy);
  };

  const handleKeyPress = (e, widgetId, asset, isBuy) => {
    if (e.key === 'Enter') {
      const amount = amounts[widgetId];
      if (amount) {
        sendTradeMessage(widgetId, amount, asset, isBuy);
      } else {
        showNotification(widgetId, 'Please enter an amount');
      }
    }
  };

  // Only render if there are widgets
  return isVisible ? (
      <div className={`widgets-bar ${isOpen ? 'open' : 'closed'}`}>
        <div className="widgets-header" onClick={() => setIsOpen(!isOpen)}>
          <button className="toggle-button">{isOpen ? '▼' : '▲'}</button>
        </div>

        {isOpen && (
            <div className="widgets-container" onClick={(e) => e.stopPropagation()}>
              {widgets.map(widget => {
                let messageObj;
                try {
                  messageObj = JSON.parse(widget.data.message);
                } catch (error) {
                  console.error('Error parsing widget message:', error);
                  return null;
                }

                const widgetData = messageObj.widget || messageObj.portfolio;
                if (!widgetData) return null;

                return (
                    <div key={widget.id} className="widget-wrapper">
                      <button
                          className="remove-widget-btn"
                          onClick={() => removeWidget(widget.id)}
                          title="Remove widget"
                      >
                        ×
                      </button>
                      <div className="widget">
                        {(widgetData.type === "PORTFOLIO" || messageObj.response?.includes("portfolio")) && (
                            <div className="portfolio-chart-widget">
                              <PortfolioChartWidget balanceData={widgetData} />
                            </div>
                        )}
                        {widgetData.type === "QUICK_TRADE" && (
                            <div className="quick-trade-widget">
                              <h3 className="widget-title">
                                {widgetData.isBuy ? 'Quick Buy' : 'Quick Sell'} {widgetData.assets[0]}
                              </h3>
                              <div className="amount-input-container">
                                <input
                                    type="text"
                                    value={amounts[widget.id] || ''}
                                    onChange={(e) => handleAmountChange(widget.id, e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, widget.id, widgetData.assets[0], widgetData.isBuy)}
                                    placeholder="Enter EUR amount"
                                    className="amount-input"
                                />
                                <span className="currency-label">EUR</span>
                              </div>
                              {notifications[widget.id] && (
                                  <div className="notification-message">
                                    {notifications[widget.id]}
                                  </div>
                              )}
                              <button
                                  className={`trade-button ${widgetData.isBuy ? 'buy' : 'sell'}`}
                                  onClick={() => handleTrade(widget.id, widgetData.assets[0], widgetData.isBuy)}
                              >
                                {widgetData.isBuy ? 'Buy' : 'Sell'} {widgetData.assets[0]}
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  ) : null;
};

export default WidgetsBar;