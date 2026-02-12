import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Statistic, Table, Tag, Avatar, Divider, Descriptions, Badge, Spin, Button, Image, Space, InputNumber, Input, message } from 'antd';
import { FaUserTie, FaBox, FaCheckCircle, FaClock, FaTruck, FaTimesCircle, FaUndo, FaEye, FaFileImage } from 'react-icons/fa';
import { getDriverDetails, approveDriver, settleDriverWallet } from '../../../../services/admin/apiDriver';
import { convertDate } from '../../../../utils/formatDate';
import { RiEBike2Fill } from 'react-icons/ri';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverDetailsModal = ({ visible, onClose, driverId }) => {
    console.log('DriverDetailsModal props:', { visible, driverId });
    const [driverDetails, setDriverDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [expandedDocument, setExpandedDocument] = useState(null);
    const [approving, setApproving] = useState(false);
    const [settleModalVisible, setSettleModalVisible] = useState(false);
    const [settleType, setSettleType] = useState('wallet');
    const [settleAmount, setSettleAmount] = useState(0);
    const [settleRemarks, setSettleRemarks] = useState('');
    const [settling, setSettling] = useState(false);

    useEffect(() => {
        if (visible && driverId) {
            fetchDriverDetails();
        } else {
            // Clear data when modal is closed
            setDriverDetails(null);
        }
    }, [visible, driverId]);

    const fetchDriverDetails = async () => {
        setLoading(true);
        try {
            const response = await getDriverDetails(driverId);
            console.log('Complete API Response:', response); // Debug log
            
            if (response?.success && response?.driver) {
                const driver = response.driver;
                
                // Fix image paths - remove "public/" prefix since files are served at root
                if (driver.image) {
                    driver.image = driver.image.replace(/^public\\/, '').replace(/\\/g, '/');
                }
                if (driver.licenseImage) {
                    driver.licenseImage = driver.licenseImage.replace(/^public\\/, '').replace(/\\/g, '/');
                }
                if (driver.adharImage) {
                    driver.adharImage = driver.adharImage.replace(/^public\\/, '').replace(/\\/g, '/');
                }
                if (driver.vehicleRcImage) {
                    driver.vehicleRcImage = driver.vehicleRcImage.replace(/^public\\/, '').replace(/\\/g, '/');
                }
                if (driver.insuranceImage) {
                    driver.insuranceImage = driver.insuranceImage.replace(/^public\\/, '').replace(/\\/g, '/');
                }
                
                // Check if bank details exist in driver object
                const mergedDriver = {
                    ...driver,
                    bankDetails: {
                        hasBankDetails: driver.bankDetails?.hasBankDetails || driver.bankDetails?.isVerified || false,
                        beneficiaryName: driver.bankDetails?.beneficiaryName || '',
                        accountNo: driver.bankDetails?.accountNo || '',
                        bankName: driver.bankDetails?.bankName || '',
                        branchName: driver.bankDetails?.branchName || '',
                        ifsc: driver.bankDetails?.ifsc || '',
                        upiId: driver.bankDetails?.upiId || '',
                        isVerified: driver.bankDetails?.isVerified || false
                    },
                    orderStats: {
                        totalOrders: response.totalOrders || driver.totalOrders || 0,
                        deliveredOrders: response.deliveredOrders || driver.deliveredOrders || 0,
                        pendingOrders: response.pendingOrders || driver.pendingOrders || 0,
                        processingOrders: response.processingOrders || driver.processingOrders || 0,
                        shippedOrders: response.shippedOrders || driver.shippedOrders || 0,
                        cancelledOrders: response.cancelledOrders || driver.cancelledOrders || 0,
                        returnedOrders: response.returnedOrders || driver.returnedOrders || 0,
                        totalEarnings: response.totalEarnings || driver.totalEarnings || 0
                    },
                    recentOrders: response.recentOrders || driver.recentOrders || []
                };
                
                console.log('Final merged driver data:', mergedDriver); // Debug log
                setDriverDetails(mergedDriver);
            } else {
                console.log('Invalid response structure:', response);
                setDriverDetails(null);
            }
        } catch (error) {
            console.error('Error fetching driver details:', error);
            setDriverDetails(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleDocumentViewer = (documentType, documentPath) => {
        if (expandedDocument?.type === documentType) {
            setExpandedDocument(null);
        } else {
            setExpandedDocument({
                type: documentType,
                path: documentPath
            });
        }
    };

    const handleApproveDriver = async () => {
        setApproving(true);
        try {
            await approveDriver(driverId, { isVerified: true });
            // Refresh driver details
            await fetchDriverDetails();
        } catch (error) {
            console.error('Error approving driver:', error);
        } finally {
            setApproving(false);
        }
    };

    const openSettleModal = (type) => {
        setSettleType(type);
        setSettleAmount(type === 'wallet' ? driverDetails.wallet_balance : driverDetails.cashCollection || 0);
        setSettleRemarks('');
        setSettleModalVisible(true);
    };

    const handleSettle = async () => {
        if (settleAmount <= 0) {
            message.error('Please enter a valid amount');
            return;
        }

        setSettling(true);
        try {
            await settleDriverWallet(driverId, settleAmount, settleRemarks, settleType);
            message.success(`${settleType === 'wallet' ? 'Wallet' : 'Cash'} settled successfully`);
            setSettleModalVisible(false);
            // Refresh driver details
            await fetchDriverDetails();
        } catch (error) {
            console.error('Error settling:', error);
            message.error(`Failed to settle ${settleType}`);
        } finally {
            setSettling(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            delivered: 'green',
            pending: 'orange',
            processing: 'blue',
            shipped: 'purple',
            cancelled: 'red',
            returned: 'volcano'
        };
        return colors[status] || 'default';
    };

    const orderColumns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <span className="text-xs">#{id?.slice(-8)}</span>,
            width: 100,
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.userId?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{record.userId?.mobileNo || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'grandTotal',
            key: 'grandTotal',
            render: (amount) => <span className="font-medium">₹{amount?.toFixed(2) || '0.00'}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status?.toUpperCase() || 'UNKNOWN'}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => convertDate(date),
        },
    ];

    if (!driverDetails && !loading) {
        return (
            <Modal
                title="Driver Details"
                open={visible}
                onCancel={onClose}
                footer={null}
                width={1000}
                destroyOnHidden
            >
                <div className="text-center py-8">
                    No driver details available
                </div>
            </Modal>
        );
    }

    if (loading) {
        return (
            <Modal
                title="Driver Details"
                open={visible}
                onCancel={onClose}
                footer={null}
                width={1000}
                destroyOnHidden
            >
                <div className="text-center py-8">
                    <Spin size="large" />
                    <div className="mt-4">Loading driver details...</div>
                </div>
            </Modal>
        );
    }

    const { orderStats = {}, recentOrders = [] } = driverDetails || {};

    // Handle case where recentOrders might not exist in API response
    const displayRecentOrders = recentOrders.length > 0 ? recentOrders : [];

    return (
        <>
            <Modal
                title="Driver Details"
                open={visible}
                onCancel={onClose}
                footer={null}
                width={1200}
                destroyOnHidden
            >
                <div className="space-y-6">
                    {/* Driver Basic Information */}
                    <Card title="Driver Information" className="mb-4">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8} className="text-center">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <Avatar 
                                        size={80} 
                                        style={{ backgroundColor: '#f56a00' }}
                                        src={driverDetails.image ? `${BASE_URL}${driverDetails.image}` : undefined}
                                    >
                                        {!driverDetails.image && <FaUserTie size={40} />}
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-center">{driverDetails.name}</h3>
                                    <div className="flex justify-center">
                                        <Tag color={driverDetails.status === 'active' ? 'green' : 'red'}>
                                            {driverDetails.status?.toUpperCase()}
                                        </Tag>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <Tag color="blue">Wallet: ₹{driverDetails.wallet_balance || 0}</Tag>
                                        <Tag color="orange">Cash: ₹{driverDetails.cashCollection || 0}</Tag>
                                    </div>
                                    <div className="flex justify-center gap-2 mt-2">
                                        {(driverDetails.wallet_balance > 0) && (
                                            <Button 
                                                size="small" 
                                                type="primary"
                                                onClick={() => openSettleModal('wallet')}
                                            >
                                                Settle Wallet
                                            </Button>
                                        )}
                                        {(driverDetails.cashCollection > 0) && (
                                            <Button 
                                                size="small" 
                                                type="default"
                                                onClick={() => openSettleModal('cash')}
                                            >
                                                Settle Cash
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={16}>
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Email">{driverDetails.email || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Mobile">{driverDetails.mobileNo || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Address" span={2}>{driverDetails.address || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="License Number">{driverDetails.licenseNumber || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Vehicle Type">{driverDetails?.vehicle?.type || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Vehicle Model">{driverDetails?.vehicle?.model || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Registration Number">{driverDetails?.vehicle?.registrationNumber || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Commission">{driverDetails.commission || 0}%</Descriptions.Item>
                                    <Descriptions.Item label="Rating">⭐ {driverDetails.rating || 'NA'}</Descriptions.Item>
                                    <Descriptions.Item label="Available">
                                        <Badge 
                                            status={driverDetails.availabilityStatus ? 'success' : 'error'} 
                                            text={driverDetails.availabilityStatus ? 'Available' : 'Unavailable'} 
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Registered">
                                        <Badge 
                                            status={driverDetails.isRegistered ? 'success' : 'error'} 
                                            text={driverDetails.isRegistered ? 'Registered' : 'Not Registered'} 
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Blocked">
                                        <Badge 
                                            status={driverDetails.isBlocked ? 'error' : 'success'} 
                                            text={driverDetails.isBlocked ? 'Blocked' : 'Active'} 
                                        />
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>

                    {/* Documents Section */}
                    <Card title="📋 Documents" className="mb-4">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="Profile Picture">
                                    {driverDetails.image ? (
                                        <div className="text-center">
                                            <Avatar 
                                                size={80} 
                                                src={`${BASE_URL}/${driverDetails.image}`}
                                                style={{ marginBottom: 8, cursor: 'pointer' }}
                                                onClick={() => toggleDocumentViewer('Profile Picture', driverDetails.image)}
                                            />
                                            <br />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                icon={<FaEye />}
                                                onClick={() => toggleDocumentViewer('Profile Picture', driverDetails.image)}
                                            >
                                                {expandedDocument?.type === 'Profile Picture' ? 'Hide' : 'View'}
                                            </Button>
                                            {expandedDocument?.type === 'Profile Picture' && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={`${BASE_URL}/${driverDetails.image}`}
                                                        alt="Profile Picture"
                                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                        placeholder={<Spin size="large" />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">No image</div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="License">
                                    {driverDetails.licenseImage ? (
                                        <div className="text-center">
                                            <FaFileImage size={40} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => toggleDocumentViewer('License', driverDetails.licenseImage)} />
                                            <br />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                icon={<FaEye />}
                                                onClick={() => toggleDocumentViewer('License', driverDetails.licenseImage)}
                                            >
                                                {expandedDocument?.type === 'License' ? 'Hide' : 'View'}
                                            </Button>
                                            {expandedDocument?.type === 'License' && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={`${BASE_URL}/${driverDetails.licenseImage}`}
                                                        alt="License"
                                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                        placeholder={<Spin size="large" />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">No license</div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="Aadhar Card">
                                    {driverDetails.adharImage ? (
                                        <div className="text-center">
                                            <FaFileImage size={40} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => toggleDocumentViewer('Aadhar Card', driverDetails.adharImage)} />
                                            <br />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                icon={<FaEye />}
                                                onClick={() => toggleDocumentViewer('Aadhar Card', driverDetails.adharImage)}
                                            >
                                                {expandedDocument?.type === 'Aadhar Card' ? 'Hide' : 'View'}
                                            </Button>
                                            {expandedDocument?.type === 'Aadhar Card' && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={`${BASE_URL}/${driverDetails.adharImage}`}
                                                        alt="Aadhar Card"
                                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                        placeholder={<Spin size="large" />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">No aadhar</div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="Vehicle RC">
                                    {driverDetails.vehicleRcImage ? (
                                        <div className="text-center">
                                            <FaFileImage size={40} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => toggleDocumentViewer('Vehicle RC', driverDetails.vehicleRcImage)} />
                                            <br />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                icon={<FaEye />}
                                                onClick={() => toggleDocumentViewer('Vehicle RC', driverDetails.vehicleRcImage)}
                                            >
                                                {expandedDocument?.type === 'Vehicle RC' ? 'Hide' : 'View'}
                                            </Button>
                                            {expandedDocument?.type === 'Vehicle RC' && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={`${BASE_URL}/${driverDetails.vehicleRcImage}`}
                                                        alt="Vehicle RC"
                                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                        placeholder={<Spin size="large" />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">No RC</div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="Insurance">
                                    {driverDetails.insuranceImage ? (
                                        <div className="text-center">
                                            <FaFileImage size={40} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => toggleDocumentViewer('Insurance', driverDetails.insuranceImage)} />
                                            <br />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                icon={<FaEye />}
                                                onClick={() => toggleDocumentViewer('Insurance', driverDetails.insuranceImage)}
                                            >
                                                {expandedDocument?.type === 'Insurance' ? 'Hide' : 'View'}
                                            </Button>
                                            {expandedDocument?.type === 'Insurance' && (
                                                <div className="mt-4">
                                                    <Image
                                                        src={`${BASE_URL}/${driverDetails.insuranceImage}`}
                                                        alt="Insurance"
                                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                                        placeholder={<Spin size="large" />}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">No insurance</div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card size="small" title="Approval Status">
                                    <div className="text-center">
                                        <Badge 
                                            status={driverDetails?.isVerified ? 'success' : 'warning'} 
                                            text={driverDetails?.isVerified ? 'Verified' : 'Pending Verification'} 
                                            style={{ marginBottom: 8 }}
                                        />
                                        <br />
                                        {!driverDetails?.isVerified && (
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                loading={approving}
                                                onClick={handleApproveDriver}
                                                style={{ marginTop: 8 }}
                                            >
                                                Approve Driver
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Card>

                    {/* Order Statistics */}
                    <Card title="📊 Order Statistics" className="mb-4">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Total Orders"
                                    value={orderStats.totalOrders || 0}
                                    prefix={<FaBox />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Delivered"
                                    value={orderStats.deliveredOrders || 0}
                                    prefix={<FaCheckCircle />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Pending"
                                    value={orderStats.pendingOrders || 0}
                                    prefix={<FaClock />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Processing"
                                    value={orderStats.processingOrders || 0}
                                    prefix={<FaTruck />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Shipped"
                                    value={orderStats.shippedOrders || 0}
                                    prefix={<FaTruck />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Cancelled"
                                    value={orderStats.cancelledOrders || 0}
                                    prefix={<FaTimesCircle />}
                                    valueStyle={{ color: '#f5222d' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Returned"
                                    value={orderStats.returnedOrders || 0}
                                    prefix={<FaUndo />}
                                    valueStyle={{ color: '#fa8c16' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Total Earnings"
                                    value={orderStats.totalEarnings || 0}
                                    prefix="₹"
                                    precision={2}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Bank Details */}
                    <Card title="🏦 Bank Details" className="mb-4">
                        {(() => {
                            const bankDetails = driverDetails?.bankDetails;
                            if (!bankDetails || !bankDetails.hasBankDetails) {
                                return <div className="text-center py-4 text-gray-500">No bank details available</div>;
                            }
                            return (
                                <Descriptions column={2} size="small">
                                    <Descriptions.Item label="Account Holder">
                                        {bankDetails.beneficiaryName || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Account Number">
                                        {bankDetails.accountNo || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Bank Name">
                                        {bankDetails.bankName || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Branch">
                                        {bankDetails.branchName || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="IFSC Code">
                                        {bankDetails.ifsc || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="UPI ID">
                                        {bankDetails.upiId || 'NA'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Bank Verified">
                                        <Badge 
                                            status={bankDetails.isVerified ? 'success' : 'error'} 
                                            text={bankDetails.isVerified ? 'Verified' : 'Not Verified'} 
                                        />
                                    </Descriptions.Item>
                                </Descriptions>
                            );
                        })()}
                    </Card>

                    {/* Recent Orders */}
                    <Card title="📋 Recent Orders (Last 10)">
                        <Table
                            columns={orderColumns}
                            dataSource={displayRecentOrders}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            scroll={{ x: true }}
                            locale={{
                                emptyText: 'No recent orders found'
                            }}
                        />
                    </Card>
                </div>
            </Modal>

            {/* Settlement Modal */}
            <Modal
                title={`Settle ${settleType === 'wallet' ? 'Wallet' : 'Cash'} - ${driverDetails?.name}`}
                open={settleModalVisible}
                onCancel={() => setSettleModalVisible(false)}
                onOk={handleSettle}
                okText="Settle"
                confirmLoading={settling}
                width={500}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <strong>Current {settleType === 'wallet' ? 'Wallet' : 'Cash'}: </strong>
                        <Tag color={settleType === 'wallet' ? 'blue' : 'orange'}>
                            ₹{settleType === 'wallet' ? driverDetails?.wallet_balance : driverDetails?.cashCollection}
                        </Tag>
                    </div>
                    
                    <div>
                        <label><strong>Amount to Settle:</strong></label>
                        <InputNumber
                            placeholder="Enter amount"
                            value={settleAmount}
                            min={0}
                            max={settleType === 'wallet' ? driverDetails?.wallet_balance : driverDetails?.cashCollection}
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
                            value={settleRemarks}
                            onChange={(e) => setSettleRemarks(e.target.value)}
                            rows={3}
                            style={{ marginTop: 8 }}
                        />
                    </div>
                </Space>
            </Modal>

        </>
    );
};

export default DriverDetailsModal;
