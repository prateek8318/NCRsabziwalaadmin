// src/components/OrderInvoice.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Card, Typography, Spin, Table, Divider, Row, Col } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import dataSource from '../data.json';

const { Title, Text } = Typography;

const OrderInvoice = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const found = dataSource.find((o) => o.booking_id === id);
        if (found) setOrderData(found);
    }, [id]);

    if (!orderData) return (
        <div className="flex justify-center mt-20">
            <Spin size="large" />
        </div>
    );

    const columns = [
        { title: 'Item', dataIndex: 'name', key: 'name' },
        { title: 'Qty', dataIndex: 'quantity', key: 'quantity', align: 'center' },
        { title: 'Unit Price', dataIndex: 'price', key: 'price', align: 'right', render: p => `₹${p}` },
        { title: 'Amount', key: 'amount', align: 'right', render: (_, r) => `₹${r.quantity * r.price}` },
    ];

    const subTotal = orderData.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const tax = subTotal * 0.1; // 10% tax
    const grandTotal = subTotal + tax;

    return (
        <Card className="mx-auto my-4 shadow-md rounded-xl border p-8 max-w-2xl invoice-card printable-card">
            <Row justify="space-between" align="middle">
                <Col><Title level={3}>Invoice</Title></Col>
                <Col>
                    {/* <Button icon={<PrinterOutlined />} onClick={() => window.print()} /> */}
                </Col>
            </Row>
            <Divider />

            <Row gutter={16} className="mb-4">
                <Col span={12}>
                    <Text strong>From:</Text>
                    <div>NCR Sabziwala</div>
                    <div>123 Dev Street, Noida</div>
                    <div>Email: NCR Sabziwala@gmail.com</div>
                </Col>
                <Col span={12} className="text-right">
                    <Text strong>To (Shop):</Text>
                    <div>{orderData.shop.name}</div>
                    <div>{orderData.shop.address}</div>
                    <Divider dashed />
                    <Text strong>Vendor:</Text>
                    <div>{orderData.vendor.name}</div>
                    <div>Phone: {orderData.vendor.phone}</div>
                </Col>
            </Row>

            <Row gutter={16} className="mb-4">
                <Col span={8}><Text>Date:</Text> <Text>{orderData.delivery_date}</Text></Col>
                <Col span={8}><Text>Invoice #:</Text> <Text>{orderData.booking_id}</Text></Col>
                <Col span={8}><Text>Delivery Time:</Text> <Text>{orderData.delivery_time}</Text></Col>
            </Row>

            <Table dataSource={orderData.items} columns={columns} rowKey="id" pagination={false} bordered />

            <div className="flex justify-end mt-4">
                <div className="w-1/2">
                    <Row justify="space-between"><Text>Subtotal:</Text><Text>₹{subTotal}</Text></Row>
                    <Row justify="space-between"><Text>Tax (10%):</Text><Text>₹{tax.toFixed(2)}</Text></Row>
                    <Divider />
                    <Row justify="space-between"><Text strong>Total:</Text><Text strong>₹{grandTotal.toFixed(2)}</Text></Row>
                </div>
            </div>

            <Divider />
            <Row className="mb-2" gutter={16}>
                <Col><Text><Text strong>Payment Method:</Text> {orderData.payment.method}</Text></Col>
                <Col className="text-right"><Text><Text strong>Payment Status:</Text> {orderData.payment.status}</Text></Col>
                <Col><Text><Text strong>Transaction ID:</Text> {orderData.payment.txn_id}</Text></Col>
            </Row>

            <Divider />
            <Text type="secondary">Thank you for your business!</Text>
        </Card>
    );
};

export default OrderInvoice;
