import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const RevenueChart = ({ data }) => {
  // Assuming data is an array of monthly values
  const monthlyData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        data: data.map(d => d.value),
        borderColor: "white",
        pointBackgroundColor: "white",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
          font: {
            size: 10
          }
        }
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 4,
      },
    },
  };

  const currentValue = data[data.length - 1].value;
  const sixMonthsAgoValue = data[0].value;
  const percentageChange = ((currentValue - sixMonthsAgoValue) / sixMonthsAgoValue * 100).toFixed(1);

  return (
    <div style={{ 
      width: '300px', 
      height: '130px', 
      background: '#0B0B0B', 
      borderRadius: '15px',
      padding: '5px 20px 20px 20px',
      color: 'white'
    }}>
      <div style={{ margin: '5px 0' }}>Portfolio Value</div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '5px' 
      }}>
        ${currentValue.toLocaleString()}
      </div>
      <div style={{ 
        color: percentageChange >= 0 ? '#4CAF50' : '#ff4444',
        fontSize: '14px',
        marginBottom: '5px'
      }}>
        {percentageChange >= 0 ? '+' : ''}{percentageChange}% over past 6 months
      </div>
      <div style={{ height: '60px' }}>
        <Line data={monthlyData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;