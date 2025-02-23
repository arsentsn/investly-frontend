import React from 'react';

const TradeHistoryDisplay = ({ trade }) => {
    // Parse numeric values ensuring proper decimal handling
    const quantity = parseFloat(trade.quantity);
    const price = parseFloat(trade.price);
    const total = parseFloat(trade.quoteQuantity); // Use quoteQuantity for total

    // Format the timestamp
    const timestamp = trade.time
        ? new Date(trade.time).toLocaleString()
        : 'N/A';

    // Get the base asset (remove USDT from symbol)
    const baseAsset = trade.symbol.replace('USDT', '');

    return (
        <div className="trade-item">
            <div className="trade-symbol">
                <span>{trade.isBuyer ? 'BUY' : 'SELL'}</span>
                <span className={`trade-type ${trade.isBuyer ? 'buy' : 'sell'}`}>
                    {trade.symbol}
                </span>
            </div>

            <div className="trade-details">
                <div className="trade-amount">
                    <span className="label">Amount:</span>
                    <span className="value">
                        {quantity.toFixed(8)} {baseAsset}
                    </span>
                </div>

                <div className="trade-price">
                    <span className="label">Price:</span>
                    <span className="value">
                        ${price.toFixed(2)}
                    </span>
                </div>

                <div className="trade-total">
                    <span className="label">Total:</span>
                    <span className="value">
                        ${total.toFixed(2)}
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