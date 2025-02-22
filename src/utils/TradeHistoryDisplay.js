import React from 'react';

const TradeHistoryDisplay = ({ trade }) => {
    // Parse numeric values and handle potential undefined/null values
    const amount = parseFloat(trade.qty || '0');
    const price = parseFloat(trade.price || '0');
    const total = amount * price;

    // Format the timestamp
    const timestamp = trade.time ? new Date(trade.time).toLocaleString() : 'N/A';

    // Determine if it's a buy or sell
    const isBuyer = trade.isBuyer || false;

    return (
        <div className="trade-item">
            <div className="trade-symbol">
                <span>{isBuyer ? 'BUY' : 'SELL'}</span>
                <span className={`trade-type ${isBuyer ? 'buy' : 'sell'}`}>
          {trade.symbol || 'Unknown'}
        </span>
            </div>

            <div className="trade-details">
                <div className="trade-amount">
                    <span className="label">Amount:</span>
                    <span className="value">
            {!isNaN(amount) ? amount.toFixed(6) : '0.00'} {trade.symbol?.replace('USDT', '')}
          </span>
                </div>

                <div className="trade-price">
                    <span className="label">Price:</span>
                    <span className="value">
            ${!isNaN(price) ? price.toFixed(2) : '0.00'}
          </span>
                </div>

                <div className="trade-total">
                    <span className="label">Total:</span>
                    <span className="value">
            ${!isNaN(total) ? total.toFixed(2) : '0.00'}
          </span>
                </div>

                <div className="trade-time">
                    <span className="label">Time:</span>
                    <span className="value">{timestamp}</span>
                </div>
            </div>
        </div>
    );
};

export default TradeHistoryDisplay;