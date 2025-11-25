import React, { useState } from 'react';
import { Card, Radio } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesGraph({ data }) {
    const [timeFrame, setTimeFrame] = useState('7d');
    const chartData = {
        labels: timeFrame === '7d'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: 'Sales',
                data: timeFrame === '7d'
                    ? data?.sales?.slice(0, 7) || []
                    : data?.sales?.slice(0, 30) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Important for custom height!
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Overview' },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Sales ($)' } },
        },
    };

    return (
        <>
            <Card
                title="Sales Graph"
                style={{
                    borderRadius: 12,
                    border: '1.5px solid #e0e0e0',
                    boxShadow: 'none',
                    minWidth: 400,
                    minHeight: 400,
                }}
                styles={{
                    body: { padding: 24 }, // ✅ This replaces `bodyStyle`
                }}
                extra={
                    <Radio.Group
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="7d">7 Days</Radio.Button>
                        <Radio.Button value="30d">30 Days</Radio.Button>
                    </Radio.Group>
                }
            >
                <div style={{ height: 340, width: '100%' }}>
                    <Bar data={chartData} options={options} />
                </div>
            </Card>
        </>
    );
}

export default SalesGraph;
