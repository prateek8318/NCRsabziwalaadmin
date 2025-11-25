import { Card, Row, Col } from 'antd';
import { DollarOutlined, CalendarOutlined, CalendarTwoTone, BarChartOutlined } from '@ant-design/icons';

function SalesOverview({ data }) {
    const stats = [
        {
            label: 'Today',
            value: data?.today || 0,
            icon: <DollarOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
            borderColor: '#1890ff',
            bgColor: '#f5f8ff', // very light blue background
            textColor: '#1890ff',
        },
        {
            label: 'Week',
            value: data?.week || 0,
            icon: <CalendarOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
            borderColor: '#52c41a',
            bgColor: '#f6ffed', // very light green background
            textColor: '#52c41a',
        },
        {
            label: 'Month',
            value: data?.month || 0,
            icon: <CalendarTwoTone twoToneColor="#faad14" style={{ fontSize: 24 }} />,
            borderColor: '#faad14',
            bgColor: '#fffbe6', // very light yellow background
            textColor: '#faad14',
        },
        {
            label: 'Year',
            value: data?.year || 0,
            icon: <BarChartOutlined style={{ color: '#722ed1', fontSize: 24 }} />,
            borderColor: '#722ed1',
            bgColor: '#f9f0ff', // very light purple background
            textColor: '#722ed1',
        },
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            <Card title="Sales Overview" style={{
                borderRadius: 12,
                border: '1.5px solid #e0e0e0',
                boxShadow: 'none',
            }}
            
            >
                <Row gutter={[16, 16]}>
                    {stats.map((stat) => (
                        <Col xs={24} sm={12} md={6} key={stat.label}>
                            <div
                                style={{
                                    background: stat.bgColor,
                                    borderRadius: 8,
                                    padding: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 8px #f0f1f2',
                                    border: `2px solid ${stat.borderColor}`, // subtle colored border
                                }}
                            >
                                {stat.icon}
                                <div
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        color: stat.textColor,
                                        margin: '12px 0 4px',
                                    }}
                                >
                                    ${stat.value.toLocaleString()}
                                </div>
                                <div style={{ fontSize: 16, color: '#595959' }}>{stat.label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
}

export default SalesOverview;
