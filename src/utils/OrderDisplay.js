import React from 'react';

const OrderDisplay = ({ orderData }) => {
    const { response, order_details } = orderData;
    const isBuyOrder = response.toLowerCase().includes('buy');

    // Helper function to format currency
    const formatCurrency = (value, currency = '€') => {
        if (!value) return 'N/A';
        return `${currency}${parseFloat(value).toFixed(2)}`;
    };

    // Helper function to format crypto amount
    const formatCryptoAmount = (amount, symbol) => {
        if (!amount) return 'N/A';
        // Remove 'USDT' from symbol if present
        const baseSymbol = symbol.replace('USDT', '');
        return `${amount} ${baseSymbol}`;
    };

    const getAmount = () => {
        if (order_details.amount) {
            return order_details.amount;
        } else if (isBuyOrder && order_details.amount_doge_bought) {
            return order_details.amount_doge_bought;
        } else if (!isBuyOrder && order_details.amount_doge_sold) {
            return order_details.amount_doge_sold;
        }
        return order_details.quantity || 'N/A';
    };

    const getPrice = () => {
        if (order_details.price_per_unit) {
            return order_details.price_per_unit;
        } else if (order_details.price_per_doge) {
            return order_details.price_per_doge;
        }
        return 'N/A';
    };

    const getTotalSpent = () => {
        if (order_details.total_spent) {
            return order_details.total_spent;
        } else if (isBuyOrder && order_details.amount_invested_euro) {
            return order_details.amount_invested_euro;
        } else if (!isBuyOrder && order_details.amount_sold_euro) {
            return order_details.amount_sold_euro;
        }
        return 'N/A';
    };

    return (
        <div className={`order-display ${isBuyOrder ? 'buy' : 'sell'}`}>
            <div className="order-header">
                <div className="order-symbol">
                    <span className={`order-type ${isBuyOrder ? 'buy' : 'sell'}`}>
                        {isBuyOrder ? 'BUY' : 'SELL'}
                    </span>
                    <span>{order_details.symbol}</span>
                </div>
                <span className="order-id">#{order_details.orderId}</span>
            </div>

            <div className="order-content">
                <div className="order-response">{response}</div>

                <div className="order-details">
                    <div className="detail-item">
                        <span className="detail-label">Amount</span>
                        <span className="detail-value">
                            {formatCryptoAmount(getAmount(), order_details.symbol)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Price per Unit</span>
                        <span className="detail-value">
                            ${parseFloat(getPrice()).toFixed(8)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Total {isBuyOrder ? 'Spent' : 'Received'}</span>
                        <span className="detail-value">
                            {formatCurrency(getTotalSpent())}
                        </span>
                    </div>
                </div>

                <div className="order-status">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${order_details.status.toLowerCase()}`}>
                        {order_details.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderDisplay;