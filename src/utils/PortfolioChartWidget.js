import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const PortfolioChartWidget = ({ balanceData }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (balanceData?.balances) {
            const transformedData = Object.entries(balanceData.balances)
                .map(([symbol, details]) => ({
                    name: details.asset,
                    value: parseFloat(details.usd_value),
                    amount: parseFloat(details.amount),
                    symbol
                }))
                .sort((a, b) => b.value - a.value);

            setData(transformedData);
        }
    }, [balanceData]);

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    if (data.length === 0) {
        return <div>Loading portfolio data...</div>;
    }

    return (
        <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: '#1a1a1a',
            borderRadius: '10px',
            padding: '15px'
        }}>
            <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '16px' }}>Portfolio Overview</h3>
                <div style={{ color: '#27f6b1', fontSize: '14px' }}>
                    Total Value: ${totalValue.toLocaleString()}
                </div>
            </div>

            <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 25, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                            dataKey="name"
                            stroke="#fff"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tick={{ fill: '#fff', fontSize: 10 }}
                        />
                        <YAxis
                            stroke="#fff"
                            tickFormatter={(value) => `$${value/1000}k`}
                            tick={{ fill: '#fff', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #333',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            formatter={(value, name, props) => {
                                const item = data.find(d => d.value === value);
                                return [
                                    `$${value.toLocaleString()}\n${item.amount} ${item.symbol}`,
                                    'Value'
                                ];
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#27f6b1"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChartWidget;