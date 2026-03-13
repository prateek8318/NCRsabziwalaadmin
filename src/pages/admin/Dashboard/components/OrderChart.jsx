import { Card, Select, Spin } from 'antd';
import { Pie } from '@ant-design/charts';
import { useState, useEffect } from 'react';
import { getOrderChart } from '../../../../services/admin/apiDashboard';

const { Option } = Select;

function OrderChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(7);

    useEffect(() => {
        fetchOrderChart();
    }, [range]);

    const fetchOrderChart = async () => {
        setLoading(true);
        try {
            const response = await getOrderChart(range);
            setData(response);
        } catch (error) {
            console.error('Error fetching order chart:', error);
        } finally {
            setLoading(false);
        }
    };

    const config = {
        data,
        angleField: 'count',
        colorField: 'name',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
            style: {
                fontSize: 12,
            },
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
        tooltip: {
            formatter: (data) => ({
                name: data.name,
                value: `${data.count} orders (₹${data.amount?.toLocaleString() || 0})`,
            }),
        },
        color: ['#52c41a', '#1890ff'],
        animation: {
            appear: {
                animation: 'scale-in',
                duration: 1000,
            },
        },
    };

    return (
        <Card
            title="Order Distribution"
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
                <Pie {...config} height={300} />
            </Spin>
        </Card>
    );
}

export default OrderChart;
