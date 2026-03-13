import { Card, Select, Spin } from 'antd';
import { Column } from '@ant-design/charts';
import { useState, useEffect } from 'react';
import { getEarningChart } from '../../../../services/admin/apiDashboard';

const { Option } = Select;

function EarningChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(7);

    useEffect(() => {
        fetchEarningChart();
    }, [range]);

    const fetchEarningChart = async () => {
        setLoading(true);
        try {
            const response = await getEarningChart(range);
            console.log('Earning Chart API Response:', response);
            console.log('Response type:', typeof response);
            console.log('Response length:', response?.length);
            
            // Ensure we have an array of data
            const chartData = Array.isArray(response) ? response : [];
            console.log('Chart Data:', chartData);
            setData(chartData);
        } catch (error) {
            console.error('Error fetching earning chart:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const config = {
        data,
        xField: 'day',
        yField: 'revenue',
        color: '#52c41a',
        columnWidthRatio: 0.6,
        meta: {
            revenue: {
                alias: 'Revenue',
                formatter: (v) => `₹${(v || 0).toLocaleString()}`,
            },
        },
        tooltip: {
            formatter: (datum) => {
                return {
                    name: 'Revenue',
                    value: `₹${(datum.revenue || 0).toLocaleString()}`,
                };
            },
        },
        label: {
            position: 'top',
            style: {
                fill: '#333',
                fontSize: 12,
                fontWeight: 'bold',
            },
            formatter: (data) => {
                return data.revenue > 0 ? `₹${data.revenue.toLocaleString()}` : '';
            },
        },
        animation: {
            appear: {
                animation: 'scale-in',
                duration: 1000,
            },
        },
        // Add empty state handling
        interactions: [
            {
                type: 'active-region',
            },
        ],
    };

    return (
        <Card
            title="Daily Revenue"
            extra={
                <Select
                    value={range}
                    onChange={setRange}
                    style={{ width: 100 }}
                    size="small"
                >
                    <Option value={7}>7 Days</Option>
                    <Option value={30}>30 Days</Option>
                    <Option value={90}>90 Days</Option>
                </Select>
            }
            style={{
                borderRadius: 12,
                borderColor: '#e0e0e0',
                boxShadow: 'none',
            }}
            styles={{ body: { padding: 18 } }}
        >
            <Spin spinning={loading}>
                {data && data.length > 0 ? (
                    <Column {...config} height={300} />
                ) : (
                    <div style={{ 
                        height: 300, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '16px'
                    }}>
                        {loading ? 'Loading...' : 'No data available'}
                    </div>
                )}
            </Spin>
        </Card>
    );
}

export default EarningChart;
