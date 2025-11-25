import { Card, Row, Col } from 'antd';
import {
    SmileOutlined,
    FrownOutlined,
    DollarCircleOutlined,
    StopOutlined,
    UserAddOutlined,
} from '@ant-design/icons';

function UserStatus({ data = {} }) {
    const stats = [
        {
            label: 'Active',
            value: data.active || 0,
            icon: <SmileOutlined />,
            borderColor: '#b39ddb', // Soft purple
            bgColor: '#f5f3ff',
        },
        {
            label: 'Inactive',
            value: data.inactive || 0,
            icon: <FrownOutlined />,
            borderColor: '#90a4ae', // Soft grey-blue
            bgColor: '#f5f7fa',
        },
        {
            label: 'Paid',
            value: data.paid || 0,
            icon: <DollarCircleOutlined />,
            borderColor: '#ffe082', // Soft yellow
            bgColor: '#fffde7',
        },
        {
            label: 'Unpaid',
            value: data.unpaid || 0,
            icon: <StopOutlined />,
            borderColor: '#ffab91', // Soft orange
            bgColor: '#fff3e0',
        },
        {
            label: 'New Users',
            value: data.newUsers || 0,
            icon: <UserAddOutlined />,
            borderColor: '#81d4fa', // Soft blue
            bgColor: '#f0faff',
        },
    ];

    return (
        <Card
            bordered
            style={{
                borderRadius: 12,
                borderColor: '#e0e0e0',
                boxShadow: 'none',
                padding: 12,
                minWidth: 320,
            }}
            bodyStyle={{ padding: 18 }}
            title="User Status Overview"
        >
            <Row gutter={[24, 18]}>
                {stats.map((stat) => (
                    <Col xs={24} sm={12} md={8} lg={12} key={stat.label}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: stat.bgColor,
                                    border: `2px solid ${stat.borderColor}`,
                                    color: stat.borderColor,
                                    fontSize: 22,
                                }}
                            >
                                {stat.icon}
                            </span>
                            <div>
                                <div style={{ color: '#757575', fontSize: 14 }}>{stat.label}</div>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>
                                    {stat.value.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}

export default UserStatus;
