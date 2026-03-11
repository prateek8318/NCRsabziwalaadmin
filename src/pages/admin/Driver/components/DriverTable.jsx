import {
    Avatar, Badge, Button, Input, InputNumber, message,
    Modal, Space, Spin, Switch, Table, Tag, Tooltip
} from 'antd';
import { FaUserTie, FaEye } from 'react-icons/fa';
import { useState } from 'react';
import { toggleDriverBlock, toggleDriverVerification, settleDriverWallet } from '../../../../services/admin/apiDriver';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverTable = ({ searchText, data, onView, loading, onSettleSuccess }) => {
    const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [settleAmount, setSettleAmount] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [settleType, setSettleType] = useState('wallet'); // 'wallet' or 'cash'
    const [togglingDriver, setTogglingDriver] = useState(null); // Track which driver is being toggled
    const [lastUpdateAction, setLastUpdateAction] = useState(null); // Track last action to prevent duplicates

    // Filter data based on search text
    const filteredData = data.filter(item => {
        if (!searchText) return true;
        
        const searchLower = searchText.toLowerCase();
        const name = (item.name || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const mobile = (item.mobileNo || '').toLowerCase();
        
        return name.includes(searchLower) || 
               email.includes(searchLower) || 
               mobile.includes(searchLower);
    });

    const handleBlockToggle = async (driverId, isBlocked) => {
        // Generate unique action key with timestamp to prevent duplicates
        const actionKey = `block-${driverId}-${isBlocked}-${Date.now()}`;
        
        if (lastUpdateAction === actionKey) {
            console.log('Block action already in progress, skipping...');
            return;
        }
        
        setLastUpdateAction(actionKey);
        setTogglingDriver(driverId);
        
        try {
            const response = await toggleDriverBlock(driverId);
            setTogglingDriver(null);
            setLastUpdateAction(null);
            
            // Only show success message after API response
            if (response?.success || response?.status) {
                message.success("Driver block status updated successfully");
            }
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            setTogglingDriver(null);
            setLastUpdateAction(null);
            message.error("Failed to update driver block status");
        }
    };

    const handleVerificationToggle = async (driverId, isRegistered) => {
        // Generate unique action key with timestamp to prevent duplicates
        const actionKey = `verification-${driverId}-${isRegistered}-${Date.now()}`;
        
        if (lastUpdateAction === actionKey) {
            console.log('Verification action already in progress, skipping...');
            return;
        }
        
        setLastUpdateAction(actionKey);
        
        try {
            const response = await toggleDriverVerification(driverId, !isRegistered);
            setLastUpdateAction(null);
            
            // // Only show success message after API response
            // if (response?.success || response?.status) {
            //     message.success("Driver verification status updated successfully");
            // }
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            setLastUpdateAction(null);
            message.error("Failed to update driver verification status");
        }
    };

    const openSettleModal = (driver, type = 'wallet') => {
        setSelectedDriver(driver);
        setSettleType(type);
        setSettleAmount(type === 'wallet' ? driver.wallet_balance : driver.cashCollection || 0);
        setRemarks(''); // Clear remarks when opening modal for different driver
        setIsSettleModalVisible(true);
    };

    const handleSettle = async () => {
        try {
            await settleDriverWallet(selectedDriver._id, settleAmount, remarks, settleType);
            message.success("Settlement done successfully");
            setIsSettleModalVisible(false);
            setRemarks(''); // Clear remarks after successful settlement
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: "center"
        },
        {
            title: 'Mobile',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
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
                        backgroundColor: record?.isBlocked ? '#1890ff' : '#d9d9d9'
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
                    <Tag color={record.wallet_balance > 0 ? 'blue' : 'default'}>
                        ₹{record.wallet_balance || 0}
                    </Tag>
                    <Tooltip title={record.wallet_balance > 0 ? "Settle Wallet" : "No wallet balance to settle"}>
                        <Button
                            type="default"
                            onClick={() => openSettleModal(record, 'wallet')}
                            disabled={record.wallet_balance <= 0}
                            size="small"
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
                    <Tag color={record.cashCollection > 0 ? 'orange' : 'default'}>
                        ₹{record.cashCollection || 0}
                    </Tag>
                    <Tooltip title={record.cashCollection > 0 ? "Settle Cash" : "No cash to settle"}>
                        <Button
                            type="default"
                            onClick={() => openSettleModal(record, 'cash')}
                            disabled={record.cashCollection <= 0}
                            size="small"
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
                            onClick={() => onView(record)}
                        >
                            View
                        </Button>
                    </Tooltip>
                </Space>
            )
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                key={Date.now()} // Force re-render
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />
            
            {/* Settlement Modal */}
            <Modal
                title={`Settle ${settleType === 'wallet' ? 'Wallet' : 'Cash'} - ${selectedDriver?.name}`}
                open={isSettleModalVisible}
                onCancel={() => {
                    setIsSettleModalVisible(false);
                    setRemarks(''); // Clear remarks when cancelling
                }}
                onOk={handleSettle}
                okText="Settle"
                confirmLoading={false}
                width={500}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <strong>Current {settleType === 'wallet' ? 'Wallet' : 'Cash'}: </strong>
                        <Tag color={settleType === 'wallet' ? 'blue' : 'orange'}>
                            ₹{settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection}
                        </Tag>
                    </div>
                    
                    <div>
                        <label><strong>Amount to Settle:</strong></label>
                        <InputNumber
                            placeholder="Enter amount"
                            value={settleAmount}
                            min={0}
                            max={settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection}
                            onChange={setSettleAmount}
                            style={{ width: '100%', marginTop: 8 }}
                            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/₹\s?|(,*)/g, '')}
                        />
                    </div>

                    <div>
                        <label><strong>Remarks:</strong></label>
                        <Input.TextArea
                            placeholder="Enter remarks (optional)"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={3}
                            style={{ marginTop: 8 }}
                        />
                    </div>
                </Space>
            </Modal>
        </>
    );
};

export default DriverTable;