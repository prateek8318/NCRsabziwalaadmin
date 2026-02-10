import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Space, Tag, message, Avatar, Statistic } from 'antd';
import { FaUserTie, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { getAvailableDriversForOrder, assignDriverToOrder } from '../../../../services/admin/apiOrder';

const DriverAssignmentModal = ({ visible, orderId, onCancel, onSuccess }) => {
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);

    useEffect(() => {
        if (visible && orderId) {
            fetchAvailableDrivers();
        }
    }, [visible, orderId]);

    const fetchAvailableDrivers = async () => {
        console.log('Fetching available drivers for order:', orderId);
        setLoading(true);
        try {
            const response = await getAvailableDriversForOrder(orderId);
            console.log('Available drivers response:', response);
            if (response?.status) {
                setAvailableDrivers(response.data || []);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching available drivers:', error);
            message.error('Failed to fetch available drivers');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDriver = async () => {
        if (!selectedDriverId) {
            message.warning('Please select a driver first');
            return;
        }

        console.log('Assigning driver:', selectedDriverId, 'to order:', orderId);
        setAssigning(true);
        try {
            const response = await assignDriverToOrder(orderId, selectedDriverId);
            console.log('Assignment response:', response);
            message.success('Driver assigned successfully!');
            onSuccess();
            onCancel();
        } catch (error) {
            console.error('Error assigning driver:', error);
            message.error('Failed to assign driver');
        } finally {
            setAssigning(false);
        }
    };

    const columns = [
        {
            title: 'Driver',
            key: 'driver',
            render: (_, record) => (
                <Space>
                    <Avatar 
                        size={40} 
                        style={{ backgroundColor: '#f56a00' }}
                        icon={<FaUserTie />}
                    />
                    <div>
                        <div><strong>{record.name}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Rating: ⭐ {record.rating || 'N/A'}
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Availability',
            dataIndex: 'availabilityStatus',
            key: 'availabilityStatus',
            align: 'center',
            render: (available) => (
                <Tag color={available ? 'green' : 'orange'}>
                    {available ? 'Available' : 'Busy'}
                </Tag>
            )
        },
        {
            title: 'Current Order',
            dataIndex: 'currentOrderId',
            key: 'currentOrderId',
            align: 'center',
            render: (orderId) => (
                <Tag color={orderId ? 'blue' : 'default'}>
                    {orderId ? `Order #${orderId}` : 'Free'}
                </Tag>
            )
        },
        {
            title: 'Wallet Balance',
            dataIndex: 'wallet_balance',
            key: 'wallet_balance',
            align: 'center',
            render: (balance) => (
                <Tag color="blue">
                    ₹{balance || 0}
                </Tag>
            )
        }
    ];

    // Statistics
    const stats = {
        total: availableDrivers.length,
        available: availableDrivers.filter(d => d.availabilityStatus).length,
        busy: availableDrivers.filter(d => !d.availabilityStatus).length,
        avgRating: availableDrivers.reduce((sum, d) => sum + (parseFloat(d.rating) || 0), 0) / availableDrivers.length || 0
    };

    return (
        <Modal
            title={`Assign Driver - Order #${orderId}`}
            open={visible}
            onCancel={onCancel}
            width={1000}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="assign"
                    type="primary"
                    loading={assigning}
                    onClick={handleAssignDriver}
                    disabled={!selectedDriverId}
                >
                    Assign Driver
                </Button>
            ]}
        >
            {/* Statistics */}
            <div style={{ marginBottom: '16px' }}>
                <Space size="large" style={{ width: '100%' }}>
                    <Statistic title="Available Drivers" value={stats.available} valueStyle={{ color: '#52c41a' }} />
                    <Statistic title="Busy Drivers" value={stats.busy} valueStyle={{ color: '#faad14' }} />
                    <Statistic title="Avg Rating" value={stats.avgRating} precision={1} valueStyle={{ color: '#1890ff' }} />
                </Space>
            </div>

            {/* Drivers Table */}
            <Table
                columns={columns}
                dataSource={availableDrivers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    showQuickJumper: true
                }}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedDriverId ? [selectedDriverId] : [],
                    onChange: (selectedKeys) => {
                        setSelectedDriverId(selectedKeys[0] || null);
                    }
                }}
                scroll={{ x: true }}
                size="small"
            />

            {/* Selected Driver Info */}
            {selectedDriverId && (
                <div style={{ 
                    marginTop: '16px', 
                    padding: '12px', 
                    backgroundColor: '#f6ffed', 
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px'
                }}>
                    <strong>Selected Driver:</strong> {
                        availableDrivers.find(d => d._id === selectedDriverId)?.name
                    }
                </div>
            )}
        </Modal>
    );
};

export default DriverAssignmentModal;
