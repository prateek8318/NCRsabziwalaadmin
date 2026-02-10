import { Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { getRecentTransaction } from '../../../services/admin/apiDashboard'

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        setLoading(true);
        try {
            const response = await getRecentTransaction();
            console.log('Recent orders API response:', response);
            
            // Transform API data to match table structure
            const transformedData = response?.data?.map(order => ({
                id: order._id || order.id,
                orderId: order.orderId || order._id || order.id,
                vendor: order.vendor?.name || 'Unknown Vendor',
                amount: order.finalAmount || order.totalAmount || order.amount || 0,
                status: order.status || 'pending',
                date: order.createdAt || order.date
            })) || [];
            
            setOrders(transformedData);
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            message.error('Failed to load recent orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Order ID', dataIndex: 'orderId' },
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

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <a href="/admin/order">View All →</a>
            </div>
            <Table
                columns={columns}
                dataSource={orders}
                pagination={false}
                size="small"
                loading={loading}
            />
        </div>
    )
}

export default RecentOrders;