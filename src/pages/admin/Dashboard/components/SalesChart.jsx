import { Card, Select, Spin } from 'antd';
import { Line } from '@ant-design/charts';
import { useState, useEffect } from 'react';
import { getSalesChart } from '../../../../services/admin/apiDashboard';

const { Option } = Select;

function SalesChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(7);

    useEffect(() => {
        fetchSalesChart();
    }, [range]);

    const fetchSalesChart = async () => {
        setLoading(true);
        try {
            const response = await getSalesChart(range);
            setData(response);
        } catch (error) {
            console.error('Error fetching sales chart:', error);
        } finally {
            setLoading(false);
        }
    };

    const config = {
        data,
        xField: 'day',
        yField: 'value',
        seriesField: 'category',
        smooth: true,
        color: ['#52c41a', '#1890ff'],
        point: {
            size: 3,
            shape: 'circle',
        },
        tooltip: {
            formatter: (data) => ({
                name: data.category,
                value: `₹${data.value?.toLocaleString() || 0}`,
            }),
        },
        legend: {
            position: 'top',
        },
        yAxis: {
            label: {
                formatter: (value) => `₹${value.toLocaleString()}`,
            },
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
    };

    // Transform data for Ant Design Charts format
    const transformedData = [];
    data?.forEach(item => {
        if (item.food) {
            transformedData.push({
                day: item.day,
                category: 'Food',
                value: item.food
            });
        }
        if (item.mart) {
            transformedData.push({
                day: item.day,
                category: 'Grocery',
                value: item.mart
            });
        }
    });

    return (
        <Card
            title="Sales Chart"
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
                <Line {...config} data={transformedData} height={300} />
            </Spin>
        </Card>
    );
}

export default SalesChart;
