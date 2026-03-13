import { Card, Table, Badge, Button, Space, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

function RecentTransactions({ data, loading }) {
    // Extract orders array from data object or use data directly if it's already an array
    const orders = Array.isArray(data) ? data : data?.orders || [];
    
    const navigate = useNavigate();
    
    const statusColorMap = {
        pending: 'orange',
        accepted: 'blue',
        delivered: 'green',
        cancelled: 'red',
        other: 'gray',
    };

    const columns = [
        {
            title: "Order ID",
            dataIndex: "_id",
            key: "_id",
            align: "center",
            render: (_, record) => (
                <span style={{ fontWeight: 600, color: '#222' }}>
                    {record.orderId || record._id || record.id || `Order #${record.orderNumber || 'N/A'}`}
                </span>
            ),
        },
        {
            title: "Customer",
            dataIndex: "shippingAddress",
            key: "userId?.name",
            align: "center",
            render: (_, record) => (
                record?.shippingAddress?.receiverName || 'N/A'
            ),
        },
        {
            title: "Amount",
            dataIndex: "grandTotal",
            key: "grandTotal",
            align: "center",
            render: (_, record) => (
                <span style={{ color: '#1890ff', fontWeight: 500 }}>
                    ₹{record.grandTotal || record.finalAmount || record.totalAmount || record.amount || record.total || '0'}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (_, record) => (
                <Badge
                    color={statusColorMap[record.status?.toLowerCase() || record.orderStatus?.toLowerCase() || 'gray']}
                    text={record.status || record.orderStatus || 'Unknown'}
                />
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: "Action",
            key: "action",
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/order/${record._id}`)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Recent Orders"
            variant="outlined"
            style={{
                borderRadius: 12,
                borderColor: '#e0e0e0',
                boxShadow: 'none',
                minWidth: 320,
            }}
            styles={{ body: { padding: 18 } }}
            loading={loading}
        >
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
            />
        </Card>
    );
}

export default RecentTransactions;
