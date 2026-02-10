import {
    Avatar, Badge, Button, Input, InputNumber, message,
    Modal, Space, Spin, Switch, Table, Tag, Tooltip
} from 'antd';
import { FaEdit, FaTrash, FaUserTie, FaEye, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { toggleDriverBlock, toggleDriverVerification, settleDriverWallet } from '../../../../services/admin/apiDriver';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverTable = ({ searchText, data, onEdit, onDelete, loading, onSettleSuccess }) => {
    const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [settleAmount, setSettleAmount] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [settleType, setSettleType] = useState('wallet'); // 'wallet' or 'cash'
    const [togglingDriver, setTogglingDriver] = useState(null); // Track which driver is being toggled

    const handleBlockToggle = async (driverId, isBlocked) => {
        console.log('Toggling block for driver:', driverId, 'current status:', isBlocked, 'new status:', !isBlocked);
        try {
            console.log('Calling toggleDriverBlock API with driverId:', driverId);
            setTogglingDriver(driverId); // Set driver being toggled
            
            // Immediately update the local data for visual feedback
            const updatedData = data.map(driver => 
                driver._id === driverId 
                    ? { ...driver, isBlocked: !isBlocked }
                    : driver
            );
            
            const response = await toggleDriverBlock(driverId);
            console.log('toggleDriverBlock API response:', response);
            setTogglingDriver(null); // Clear toggling state
            message.success("Driver block status updated successfully");
            console.log('Block toggle successful, refreshing driver data...');
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            setTogglingDriver(null); // Clear toggling state on error
            console.error('Error in block toggle:', error);
            message.error("Failed to update driver block status");
        }
    };

    const handleVerificationToggle = async (driverId, isRegistered) => {
        console.log('Toggling verification for driver:', driverId, 'current status:', isRegistered, 'new status:', !isRegistered);
        try {
            // Immediately update the local data for visual feedback
            const updatedData = data.map(driver => 
                driver._id === driverId 
                    ? { ...driver, isVerified: !isRegistered }
                    : driver
            );
            
            await toggleDriverVerification(driverId, !isRegistered);
            message.success("Driver verification status updated successfully");
            console.log('Verification toggle successful, refreshing driver data...');
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            console.error('Error in verification toggle:', error);
            message.error("Failed to update driver verification status");
        }
    };

    const openSettleModal = (driver, type = 'wallet') => {
        setSelectedDriver(driver);
        setSettleType(type);
        setSettleAmount(type === 'wallet' ? driver.wallet_balance : driver.cashCollection || 0);
        setRemarks('');
        setIsSettleModalVisible(true);
    };

    const handleSettle = async () => {
        try {
            console.log('Settling wallet for driver:', selectedDriver._id, 'amount:', settleAmount, 'remarks:', remarks);
            await settleDriverWallet(selectedDriver._id, settleAmount, remarks);
            message.success("Settlement done successfully");
            setIsSettleModalVisible(false);
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            console.error("Settlement error:", error);
            // Show more specific error message based on error status
            if (error.response?.status === 400) {
                message.error("Invalid settlement request. Please check the amount and remarks.");
            } else if (error.response?.status === 404) {
                message.error("Driver not found or settlement endpoint not available.");
            } else {
                message.error("Failed to settle amount. Please try again.");
            }
        }
    };

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            align: "center",
            render: (_, { image, name }) => (
                <Avatar size={40} style={{ backgroundColor: '#f56a00' }}>
                    {image ? <img src={`${BASE_URL}/${image}`} alt={name} /> : <FaUserTie />}
                </Avatar>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: 'Vehicle Type',
            key: 'vehicleType',
            align: "center",
            render: (_, record) => record?.vehicle?.type || '-'
        },
        {
            title: 'Vehicle Model',
            key: 'vehicleModel',
            align: "center",
            render: (_, record) => record?.vehicle?.model || '-'
        },
        {
            title: 'Registration No.',
            key: 'vehicleReg',
            align: "center",
            render: (_, record) => record?.vehicle?.registrationNumber || '-'
        },
        {
            title: 'License No.',
            key: 'licenseNumner',
            align: "center",
            render: (_, record) => record?.licenseNumber || '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status ? String(status).toUpperCase() : 'UNKNOWN'}
                </Tag>
            ),
        },
        {
            title: 'Verification',
            dataIndex: 'isVerified',
            key: 'isVerified',
            align: "center",
            render: (_, record) => (
                <Tooltip title={record.isVerified ? "Verified" : "Not Verified"}>
                    <Switch
                        key={`verification-${record._id}-${record.isVerified}`}
                        checked={record?.isVerified}
                        onChange={() => handleVerificationToggle(record._id, record.isVerified)}
                        unCheckedChildren="?"
                    />
                </Tooltip>
            )
        },
        {
            title: 'Block',
            dataIndex: 'isBlocked',
            key: 'isBlocked',
            align: "center",
            render: (_, record) => (
                <Switch
                    key={`block-${record._id}-${record.isBlocked}`}
                    checked={record?.isBlocked}
                    onChange={(checked) => handleBlockToggle(record._id, checked)}
                    checkedChildren=""
                    unCheckedChildren=""
                    style={{
                        backgroundColor: record?.isBlocked ? '#1890ff' : '#d9d9d9',
                        '& .ant-switch-handle': {
                            backgroundColor: record?.isBlocked ? '#1890ff' : '#d9d9d9',
                        }
                    }}
                />
            )
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.wallet_balance || 0}</Tag>
                    <Tooltip title="Settle Wallet">
                        <Button
                            type="default"
                            onClick={() => openSettleModal(record, 'wallet')}
                        >
                            Settle
                        </Button>
                    </Tooltip>
                </Space>
            )
        },
        {
            title: 'Cash',
            dataIndex: 'cashCollection',
            key: 'cashCollection',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.cashCollection || 0}</Tag>
                    <Tooltip title="Settle Cash">
                        <Button
                            type="default"
                            onClick={() => openSettleModal(record, 'cash')}
                        >
                            Settle
                        </Button>
                    </Tooltip>
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            icon={<FaEye />}
                            onClick={() => onEdit(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Delete Driver">
                        <Button
                            type="primary"
                            danger
                            icon={<FaTrash />}
                            onClick={() => onDelete(record)}
                            size="small"
                        />
                    </Tooltip>
                </Space>
            )
        },
    ];

    const filteredData = data.filter((item) =>
        item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.vehicle?.type?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.vehicle?.model?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.vehicle?.registrationNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.licenseNumber?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                key={Date.now()} // Force re-render
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />

            <Modal
                title={`Settle ${settleType === 'wallet' ? 'Wallet' : 'Cash'} - ${selectedDriver?.name}`}
                open={isSettleModalVisible}
                onCancel={() => setIsSettleModalVisible(false)}
                onOk={handleSettle}
                okText="Settle"
            >
                <p>
                    <strong>Current {settleType === 'wallet' ? 'Wallet' : 'Cash'}: </strong>
                    ₹{settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection}
                </p>
                <InputNumber
                    placeholder="Enter amount to settle"
                    value={settleAmount}
                    min={0}
                    onChange={setSettleAmount}
                    style={{ width: '100%', marginBottom: 10 }}
                />
                <Input.TextArea
                    placeholder="Remarks (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                />
            </Modal>
        </>
    );
};

export default DriverTable;