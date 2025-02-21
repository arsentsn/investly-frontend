import React, { useState } from 'react';
import RevenueChart from './Widgets';

function WidgetsBar({ portfolioData }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div 
            className={`widgets-bar ${isOpen ? 'open' : 'closed'}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen && (
                <div className="widgets-container">
                    <RevenueChart data={portfolioData} />
                </div>
            )}
        </div>
    );
}

export default WidgetsBar;