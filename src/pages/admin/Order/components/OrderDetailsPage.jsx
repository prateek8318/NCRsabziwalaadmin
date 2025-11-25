import React, { useEffect, useState } from 'react';
import {
    Card,
    Typography,
    Descriptions,
    Table,
    Spin,
    message,
    Divider,
    Select,
    Button,
    Space,
    Row,
    Col
} from 'antd';
import { useParams } from 'react-router';
import { getOrderDetails, getAllDrivers, assignDriver, downloadInvoice } from '../../../../services/admin/apiOrder';
import { DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const OrderDetailsPage = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [assigning, setAssigning] = useState(false);

    const { orderId } = useParams();

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const response = await getOrderDetails(id);
                setOrder(response.order);
                // const driverResponse = await getAllDrivers(id);
                // setDrivers(driverResponse.data || []);
            } catch (error) {
                message.error('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData(orderId);
    }, [orderId]);

    const handleAssignDriver = async () => {
        if (!selectedDriver) {
            message.warning('Please select a driver.');
            return;
        }

        setAssigning(true);
        try {
            await assignDriver(orderId, selectedDriver);
            message.success('Driver assigned successfully!');
            setOrder(prev => ({
                ...prev,
                assignedDriver: drivers.find(d => d._id === selectedDriver)
            }));
        } catch (error) {
            // already handled in API
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    if (!order) {
        return <Text type="danger">No order data found.</Text>;
    }

    const productColumns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, record) =>
                `${record.productId?.name || 'N/A'} - ${record.name?.split(' - ')[1] || ''}`
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit'
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: value => `₹${value}`,
        },
        {
            title: 'Original Price',
            dataIndex: 'originalPrice',
            key: 'originalPrice',
            render: value => value ? `₹${value}` : '—',
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
            key: 'discount',
            render: value => `${value}%`
        },
        {
            title: 'Final',
            dataIndex: 'finalPrice',
            key: 'finalPrice',
            render: value => `₹${value}`,
        },
    ];

    const handleInvoiceDownload = async (orderId) => {
        try {
            await downloadInvoice(orderId)
        } catch (error) {
            message.error("Error in invoice download")
        }
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Order Details</Title>
                <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleInvoiceDownload(orderId)}>
                    Download Invoice
                </Button>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card size="small">
                        <Descriptions column={2} size="small" bordered>
                            <Descriptions.Item label="Order ID">{order.orderId}</Descriptions.Item>
                            <Descriptions.Item label="User">{order.userId?.name} ({order.userId?.email})</Descriptions.Item>
                            <Descriptions.Item label="Delivery Time">
                                {new Date(order.deliveryDate).toLocaleDateString()} at {order.deliveryTime}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">{order.orderStatus}</Descriptions.Item>
                            <Descriptions.Item label="Payment Mode">{order.paymentMode}</Descriptions.Item>
                            <Descriptions.Item label="Payment Status">{order.paymentStatus}</Descriptions.Item>
                            <Descriptions.Item label="Driver">
                                {order.assignedDriver?.name || <Text type="secondary">Not Assigned</Text>}
                            </Descriptions.Item>
                        </Descriptions>

                        {order.orderStatus == "ready" && !order.assignedDriver && (
                            <Space style={{ marginTop: 16 }}>
                                <Select
                                    style={{ width: 250 }}
                                    placeholder="Select Delivery Boy"
                                    value={selectedDriver}
                                    onChange={(value) => setSelectedDriver(value)}
                                >
                                    {drivers.map(driver => (
                                        <Option key={driver._id} value={driver._id}>
                                            {driver.name} ({driver.mobileNo || 'No Phone'}) {driver.distanceInMeters ? `(${Math.round(driver.distanceInMeters / 1000)}km)` : ''}
                                        </Option>
                                    ))}
                                </Select>
                                <Button
                                    type="primary"
                                    loading={assigning}
                                    onClick={handleAssignDriver}
                                >
                                    Assign
                                </Button>
                            </Space>
                        )}
                    </Card>

                    <Card title="Delivery Address" size="small" style={{ marginTop: 16 }}>
                        <Text strong>{order.deliveryAddressId?.name}</Text>
                        <div>{order.deliveryAddressId?.address1}</div>
                        <div>{order.deliveryAddressId?.address2}</div>
                        <div>
                            {order.deliveryAddressId?.city}, {order.deliveryAddressId?.state} - {order.deliveryAddressId?.pincode}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Order Summary" size="small">
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Item Total">₹{order.itemTotal}</Descriptions.Item>
                            <Descriptions.Item label="Packing Charge">₹{order.packingCharge}</Descriptions.Item>
                            <Descriptions.Item label="Delivery Charge">₹{order.deliveryCharge}</Descriptions.Item>
                            <Descriptions.Item label="Coupon Discount">₹{order.couponDiscount}</Descriptions.Item>
                            <Descriptions.Item label="Final Total">₹{order.finalAmount}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Card title="Products" size="small" style={{ marginTop: 24 }}>
                <Table
                    dataSource={order.items}
                    columns={productColumns}
                    pagination={false}
                    rowKey={(record, index) => index}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default OrderDetailsPage;
