import React from 'react';

const TradeHistoryDisplay = ({ trade }) => {
    // Ensure numeric conversions
    const price = parseFloat(trade.price);
    const quantity = parseFloat(trade.qty);
    const total = price * quantity;

    // Format the date
    const tradeDate = new Date(trade.time);
    const formattedDate = tradeDate.toLocaleString();

    return (
        <div className="trade-item">
            <div className="trade-symbol">
        <span className={`trade-type ${trade.isBuyer ? 'buy' : 'sell'}`}>
          {trade.isBuyer ? 'BUY' : 'SELL'}
        </span>
                {trade.symbol}
            </div>
            <div className="trade-details">
                <div className="trade-amount">
                    <span className="label">Amount:</span>
                    <span className="value">
            {quantity.toFixed(6)} {trade.symbol.replace('USDT', '')}
          </span>
                </div>
                <div className="trade-price">
                    <span className="label">Price:</span>
                    <span className="value">${price.toFixed(2)}</span>
                </div>
                <div className="trade-total">
                    <span className="label">Total:</span>
                    <span className="value">${total.toFixed(2)}</span>
                </div>
                <div className="trade-time">
                    <span className="label">Time:</span>
                    <span className="value">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
};

export default TradeHistoryDisplay;