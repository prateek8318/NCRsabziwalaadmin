import { Card, List, Avatar, Badge } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';

function RecentTransactions({ data, loading }) {
    const statusColorMap = {
        pending: 'orange',
        accepted: 'blue',
        delivered: 'green',
        cancelled: 'red',
        other: 'gray',
    };

    return (
        <Card
            title="Recent Order"
            variant="outlined" // ✅ replaces `bordered`
            style={{
                borderRadius: 12,
                borderColor: '#e0e0e0',
                boxShadow: 'none',
                minWidth: 320,
            }}
            styles={{ body: { padding: 18 } }} // ✅ replaces `bodyStyle`
            loading={loading}
        >
            <div
                style={{
                    maxHeight: 520,
                    overflowY: 'auto',
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={data || []}
                    split={false}
                    locale={{ emptyText: "No transactions" }}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                background: '#fafbfc',
                                borderRadius: 8,
                                marginBottom: 12,
                                border: '1px solid #f0f0f0',
                                padding: '12px 16px',
                                alignItems: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            background: '#f0f5ff',
                                            color: '#1890ff',
                                            border: '1.5px solid #d6e4ff',
                                        }}
                                        icon={<DollarCircleOutlined />}
                                    />
                                }
                                title={
                                    <span style={{ fontWeight: 600, color: '#222' }}>
                                        {item.orderId}
                                    </span>
                                }
                                description={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Badge
                                            color={statusColorMap[item.orderStatus?.toLowerCase()] || 'gray'}
                                            text={item.orderStatus}
                                        />
                                        <span style={{ color: '#1890ff', fontWeight: 500 }}>
                                            ₹{item.finalAmount}
                                        </span>
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Card>
    );
}

export default RecentTransactions;
