import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Tag, Space, Input, message, Card, Row, Col, Statistic } from 'antd';
import { FaCheckCircle, FaTimesCircle, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import { getDriverWalletRequests, verifySettleWalletRequest } from '../../../../services/admin/apiDriver';

const WalletRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [action, setAction] = useState('approve');
    const [remark, setRemark] = useState('');

    const fetchWalletRequests = async () => {
        setLoading(true);
        try {
            const response = await getDriverWalletRequests();
            if (response?.status === 'success') {
                setRequests(response.wallet_request || []);
            } else {
                // Handle case where API returns different structure
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching wallet requests:', error);
            // Show user-friendly message for 500 errors
            if (error.response?.status === 500) {
                message.info('Wallet requests feature is currently under maintenance. Please check back later.');
            }
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletRequests();
    }, []);

    const handleAction = (request, actionType) => {
        setSelectedRequest(request);
        setAction(actionType);
        setRemark('');
        setActionModalVisible(true);
    };

    const handleView = (request) => {
        setSelectedRequest(request);
        console.log('Request data:', request); // Debug log to see data structure
        setViewModalVisible(true);
    };

    const handleConfirmAction = async () => {
        try {
            await verifySettleWalletRequest(selectedRequest._id, action, remark);
            message.success(`Wallet request ${action}d successfully`);
            setActionModalVisible(false);
            fetchWalletRequests(); // Refresh the list
        } catch (error) {
            console.error('Error processing wallet request:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'green';
            case 'rejected': return 'red';
            case 'pending': return 'orange';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Request ID',
            dataIndex: '_id',
            key: '_id',
            render: (id) => id.slice(-8),
            width: 100
        },
        {
            title: 'Driver',
            key: 'driver',
            render: (_, record) => (
                <div>
                    <div><strong>{record.driverId?.name}</strong></div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Wallet: ₹{record.driverId?.wallet_balance || 0}
                    </div>
                </div>
            )
        },
        {
            title: 'Amount Requested',
            dataIndex: 'amount_requested',
            key: 'amount_requested',
            render: (amount) => (
                <Tag color="blue">₹{amount}</Tag>
            ),
            align: 'center'
        },
        {
            title: 'Request Date',
            dataIndex: 'request_date',
            key: 'request_date',
            render: (date) => new Date(date).toLocaleDateString(),
            align: 'center'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status?.toUpperCase()}
                </Tag>
            ),
            align: 'center'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                icon={<FaCheckCircle />}
                                onClick={() => handleAction(record, 'approve')}
                                size="small"
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<FaTimesCircle />}
                                onClick={() => handleAction(record, 'reject')}
                                size="small"
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {record.status !== 'pending' && (
                        <Button
                            type="default"
                            icon={<FaEye />}
                            onClick={() => handleView(record)}
                            size="small"
                        >
                            View
                        </Button>
                    )}
                </Space>
            ),
            align: 'center'
        }
    ];

    // Calculate statistics
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        totalAmount: requests.reduce((sum, r) => sum + (r.amount_requested || 0), 0)
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Requests"
                            value={stats.total}
                            prefix={<FaMoneyBillWave />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pending}
                            prefix={<FaEye />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Approved"
                            value={stats.approved}
                            prefix={<FaCheckCircle />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Amount"
                            value={stats.totalAmount}
                            prefix="₹"
                            valueStyle={{ color: '#722ed1' }}
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Requests Table */}
            <Card title="Driver Wallet Requests">
                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} requests`
                    }}
                    scroll={{ x: true }}
                />
            </Card>

            {/* Action Modal */}
            <Modal
                title={`${action === 'approve' ? 'Approve' : 'Reject'} Wallet Request`}
                open={actionModalVisible}
                onOk={handleConfirmAction}
                onCancel={() => setActionModalVisible(false)}
                okText={action === 'approve' ? 'Approve & Settle' : 'Reject'}
                okType={action === 'approve' ? 'primary' : 'danger'}
            >
                <div style={{ marginBottom: '16px' }}>
                    <p><strong>Driver:</strong> {selectedRequest?.driverId?.name}</p>
                    <p><strong>Amount:</strong> ₹{selectedRequest?.amount_requested}</p>
                    <p><strong>Current Wallet:</strong> ₹{selectedRequest?.driverId?.wallet_balance || 0}</p>
                </div>
                
                <Input.TextArea
                    placeholder="Enter remark (optional)"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={4}
                    style={{ marginBottom: '16px' }}
                />
                
                {action === 'approve' && (
                    <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#f6ffed', 
                        border: '1px solid #b7eb8f',
                        borderRadius: '6px'
                    }}>
                        <strong>Note:</strong> This will approve the request and settle the amount to the driver's wallet.
                    </div>
                )}
            </Modal>

            {/* View Details Modal */}
            <Modal
                title="Wallet Request Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedRequest && (
                    <div style={{ lineHeight: '1.8' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div><strong>Request ID:</strong></div>
                                <div style={{ marginBottom: '12px', fontFamily: 'monospace' }}>
                                    {selectedRequest._id}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Status:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    <Tag color={getStatusColor(selectedRequest.status)}>
                                        {selectedRequest.status?.toUpperCase()}
                                    </Tag>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Driver Name:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    {selectedRequest.name || 'Not available'}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Driver Email:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    {selectedRequest.email || 'Not available'}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Driver Mobile:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    {selectedRequest.mobileNo || 'Not available'}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Current Wallet Balance:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    <Tag color="blue">₹{selectedRequest.wallet_balance || 0}</Tag>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Amount Requested:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    <Tag color="green">₹{selectedRequest.amount_requested}</Tag>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div><strong>Request Date:</strong></div>
                                <div style={{ marginBottom: '12px' }}>
                                    {new Date(selectedRequest.request_date).toLocaleString()}
                                </div>
                            </Col>
                            {selectedRequest.processed_date && (
                                <Col span={12}>
                                    <div><strong>Processed Date:</strong></div>
                                    <div style={{ marginBottom: '12px' }}>
                                        {new Date(selectedRequest.processed_date).toLocaleString()}
                                    </div>
                                </Col>
                            )}
                            {selectedRequest.remark && (
                                <Col span={24}>
                                    <div><strong>Remark:</strong></div>
                                    <div style={{ 
                                        marginBottom: '12px',
                                        padding: '8px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px'
                                    }}>
                                        {selectedRequest.remark}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WalletRequests;
