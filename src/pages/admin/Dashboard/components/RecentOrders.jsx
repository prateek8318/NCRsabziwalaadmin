import { Table, Tag } from 'antd'

const columns = [
    { title: 'Order ID', dataIndex: 'id' },
    { title: 'Vendor', dataIndex: 'vendor' },
    { title: 'Amount', dataIndex: 'amount' },
    {
        title: 'Status',
        dataIndex: 'status',
        render: status => (
            <Tag color={status === 'Completed' ? 'green' : 'orange'}>
                {status}
            </Tag>
        )
    },
    { title: 'Date', dataIndex: 'date' },
];

const data = [
    { id: '#1234', vendor: 'Food Store', amount: 120, status: 'Completed', date: '2024-03-20' },
    // Add more orders...
];

export default function RecentOrders() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <a href="/orders">View All →</a>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                size="small"
            />
        </div>
    )
}