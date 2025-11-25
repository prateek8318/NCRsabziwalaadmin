import { Button, message, Space, Table, Tag } from 'antd';
import { FaTrash } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { getAllOrder } from '../../../../services/admin/apiOrder';
import { useEffect, useState } from 'react';
import { convertDate } from '../../../../utils/formatDate';

const OrderTable = ({ searchText, onDelete, type }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchOrderList(type) }, [type]);

    const fetchOrderList = async (type) => {
        setLoading(true)
        try {
            const res = await getAllOrder(type)
            setOrders(res.orders || [])
            // console.log(res.orders)
        } catch (error) {
            console.log(error)
            // message.error("something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = (record) => {
        navigate(`/admin/order/${record._id}`);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            align: 'center',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            align: 'center',
            render: (deliveryDate) => `${convertDate(deliveryDate)}`,
        },
        {
            title: 'Delivery Time',
            dataIndex: 'deliveryTime',
            key: 'deliveryTime',
            align: 'center',
        },
        {
            title: 'Total Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
            align: 'center',
            render: (amount) => `₹${amount}`,
        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (status) => (
                <Tag
                    color={
                        status === 'delivered'
                            ? 'green'
                            : status === 'accepted'
                                ? 'blue'
                                : 'orange'
                    }
                >
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            align: 'center',
            render: (status) => (
                <Tag
                    color={
                        status == 'paid'
                            ? 'green'
                            : status == 'pending'
                                ? 'orange'
                                : 'red'
                    }
                >
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
            align: 'center',
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignedDriver',
            key: 'assignedDriver',
            align: 'center',
            render: (assignedDriver) =>
                assignedDriver ? (
                    <Tag color="green">{assignedDriver}</Tag>
                ) : (
                    <Tag color="red">Not Assigned</Tag>
                ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<IoMdEye />}
                        onClick={() => handleViewDetails(record)}
                    />
                    {/* <Button
                        type="primary"
                        danger
                        icon={<FaTrash />}
                        onClick={() => onDelete(record)}
                    /> */}
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={orders.filter((item) =>
                item.orderId.toLowerCase().includes(searchText.toLowerCase())
            )}
            columns={columns}
            rowKey="_id"
            scroll={{ x: true }}
            bordered
            size="small"
            loading={loading}
        />
    );
};

export default OrderTable;
