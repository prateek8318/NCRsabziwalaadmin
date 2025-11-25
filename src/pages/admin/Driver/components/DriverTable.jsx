import {
    Avatar, Badge, Button, Input, InputNumber, message,
    Modal, Space, Spin, Switch, Table, Tag, Tooltip
} from 'antd';
import { FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
import { useState } from 'react';
import { updateDriverStatus } from '../../../../services/admin/apiDrivers';
import { settleWallet } from '../../../../services/admin/apiWallet'; // Make sure this is appropriate
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverTable = ({ searchText, data, onEdit, onDelete, loading, onSettleSuccess }) => {
    const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [settleAmount, setSettleAmount] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [settleType, setSettleType] = useState('wallet'); // 'wallet' or 'cash'

    const openSettleModal = (driver, type = 'wallet') => {
        setSelectedDriver(driver);
        setSettleType(type);
        setSettleAmount(type === 'wallet' ? driver.wallet_balance : driver.cashCollection || 0);
        setRemarks('');
        setIsSettleModalVisible(true);
    };

    const handleSettle = async () => {
        const currentAmount = settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection;
        if (settleAmount !== currentAmount) {
            message.error("Settle total amount in single time");
            return;
        }

        const payload = {
            amount: settleAmount,
            remark: settleType == "wallet" ? `Driver Wallet Setlment ${remarks}` : `Cash Order Setlment ${remarks}`,
            type: settleType
        };

        try {
            await settleWallet(payload, selectedDriver._id); // Adjust API to handle driver + type
            message.success("Settlement done successfully");
            setIsSettleModalVisible(false);
            if (onSettleSuccess) onSettleSuccess(selectedDriver._id);
        } catch (error) {
            console.error("Settlement error:", error);
            message.error("Failed to settle amount");
        } finally {
            onSettleSuccess()
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
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Block',
            dataIndex: 'isBlocked',
            key: 'isBlocked',
            align: "center",
            render: (_, record) => (
                <Switch
                    defaultChecked={record?.isBlocked}
                    onChange={(checked) => updateDriverStatus(record._id, checked)}
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
    ];

    const filteredData = data.filter((item) =>
        item?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
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