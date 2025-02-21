import React, { useState } from "react";
import RevenueChart from "./Widgets";
import WidgetRenderer from "./WidgetRenderer";

const backendDataQuickTrade = {
  id: 143,
  message:
    '{ "response": "A quick buy button widget for Bitcoin has been created successfully.", "widget": { "type": "QUICK_TRADE", "assets": ["BTC"], "isBuy": true } }',
  timestamp: "2025-02-21T19:53:52.365964+02:00",
  messageEntity: {
    id: 158,
    textPrompt: null,
    timestamp: null,
    threadId: null,
  },
  threadId: "thread_T0TrnME68enerihbBIbuOd3a",
};

const backendDataPortfolio = {
  id: 144,
  message:
    '{ "response": "A portfolio overview widget has been created successfully.", "widget": { "type": "PORTFOLIO", "assets": [], "balanceData": { "balances": [ { "asset": "ETH", "free": "1.0183", "locked": "0.0000" }, { "asset": "BTC", "free": "1.0076", "locked": "0.0000" }, { "asset": "LTC", "free": "4.0000", "locked": "0.0000" }, { "asset": "BNB", "free": "1.0000", "locked": "0.0000" }, { "asset": "XRP", "free": "195.0000", "locked": "0.0000" }, { "asset": "ADA", "free": "650.0000", "locked": "0.0000" }, { "asset": "DOGE", "free": "2858.0000", "locked": "0.0000" }, { "asset": "SOL", "free": "2.0000", "locked": "0.0000" }, { "asset": "DOT", "free": "103.0000", "locked": "0.0000" } ] } } }',
  timestamp: "2025-02-21T19:55:14.4444+02:00",
  messageEntity: {
    id: 159,
    textPrompt: null,
    timestamp: null,
    threadId: null,
  },
  threadId: "thread_T0TrnME68enerihbBIbuOd3a",
};

function WidgetsBar({ portfolioData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`widgets-bar ${isOpen ? "open" : "closed"}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen && (
        <div className="widgets-container">
          <div onClick={(e) => e.stopPropagation()}>
            <RevenueChart data={portfolioData} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <WidgetRenderer widgetData={backendDataQuickTrade} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <WidgetRenderer widgetData={backendDataPortfolio} />
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetsBar;
