import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, Card, Row, Col, Statistic, Tabs } from 'antd';
import { FaPlus, FaUser, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { RiEBike2Fill } from 'react-icons/ri';
import DriverTable from './components/DriverTable';
import WalletRequests from './components/WalletRequests';
import AddDriverModal from './components/AddDriverModel';
import EditDriverModal from './components/EditDriverModal';
import { getAllDrivers, getDriverStatistics } from '../../../services/admin/apiDriver';

function DriverManagement() {
    const [drivers, setDrivers] = useState([]);
    const [activeTab, setActiveTab] = useState('drivers');
    const [statistics, setStatistics] = useState({
        totalDrivers: 0,
        activeDrivers: 0,
        inactiveDrivers: 0,
        blockedDrivers: 0,
        unblockedDrivers: 0,
        registeredDrivers: 0,
        unregisteredDrivers: 0,
        verifiedDrivers: 0,
        pendingVerification: 0,
        availableDrivers: 0,
        unavailableDrivers: 0,
        onDutyDrivers: 0,
        totalWalletBalance: 0,
        totalCashCollection: 0,
        averageRating: 0,
        recentRegistrations: 0,
        vehicleTypeBreakdown: {}
    });
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const fetchDrivers = async () => {
        setLoading(true);
        try {
            console.log('Fetching drivers...');
            const response = await getAllDrivers();
            if (response?.status && Array.isArray(response.data)) {
                console.log('Raw driver data from API:', response.data);
                setDrivers(response.data);
                console.log('Drivers fetched successfully:', response.data.length, 'drivers');
                
                // Log specific driver verification status
                const targetDriver = response.data.find(d => d._id === '68bd107f3097b2a31948162c');
                if (targetDriver) {
                    console.log('Target driver verification status (isVerified):', targetDriver.isVerified);
                    console.log('Target driver isRegistered status:', targetDriver.isRegistered);
                }
            } else {
                setDrivers([]);
                message.warning("No drivers found.");
            }
        } catch (err) {
            console.error("Error fetching drivers:", err);
            message.error("Failed to load drivers.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await getDriverStatistics();
            if (response?.success) {
                setStatistics(response.statistics);
            }
        } catch (err) {
            console.error("Error fetching statistics:", err);
            // Calculate statistics from driver data as fallback
            if (drivers.length > 0) {
                const stats = {
                    totalDrivers: drivers.length,
                    activeDrivers: drivers.filter(d => d.status === 'active').length,
                    inactiveDrivers: drivers.filter(d => d.status === 'inactive').length,
                    blockedDrivers: drivers.filter(d => d.isBlocked).length,
                    unblockedDrivers: drivers.filter(d => !d.isBlocked).length,
                    registeredDrivers: drivers.filter(d => d.isRegistered).length,
                    unregisteredDrivers: drivers.filter(d => !d.isRegistered).length,
                    verifiedDrivers: drivers.filter(d => d.isRegistered).length,
                    pendingVerification: drivers.filter(d => !d.isRegistered).length,
                    availableDrivers: drivers.filter(d => d.availabilityStatus).length,
                    unavailableDrivers: drivers.filter(d => !d.availabilityStatus).length,
                    onDutyDrivers: drivers.filter(d => d.currentOrderId).length,
                    totalWalletBalance: drivers.reduce((sum, d) => sum + (d.wallet_balance || 0), 0),
                    totalCashCollection: drivers.reduce((sum, d) => sum + (d.cashCollection || 0), 0),
                    averageRating: drivers.reduce((sum, d) => sum + (parseFloat(d.rating) || 0), 0) / drivers.length || 0,
                    recentRegistrations: 0, // Can't calculate from available data
                    vehicleTypeBreakdown: drivers.reduce((acc, d) => {
                        const type = d.vehicle?.type || 'unknown';
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {})
                };
                setStatistics(stats);
            }
        }
    };

    useEffect(() => { 
        fetchDrivers();
        fetchStatistics();
    }, []);

    useEffect(() => {
        // Recalculate statistics when drivers data changes (if API stats failed)
        if (drivers.length > 0 && !statistics.totalDrivers) {
            const stats = {
                totalDrivers: drivers.length,
                activeDrivers: drivers.filter(d => d.status === 'active').length,
                inactiveDrivers: drivers.filter(d => d.status === 'inactive').length,
                blockedDrivers: drivers.filter(d => d.isBlocked).length,
                unblockedDrivers: drivers.filter(d => !d.isBlocked).length,
                registeredDrivers: drivers.filter(d => d.isRegistered).length,
                unregisteredDrivers: drivers.filter(d => !d.isRegistered).length,
                verifiedDrivers: drivers.filter(d => d.isRegistered).length,
                pendingVerification: drivers.filter(d => !d.isRegistered).length,
                availableDrivers: drivers.filter(d => d.availabilityStatus).length,
                unavailableDrivers: drivers.filter(d => !d.availabilityStatus).length,
                onDutyDrivers: drivers.filter(d => d.currentOrderId).length,
                totalWalletBalance: drivers.reduce((sum, d) => sum + (d.wallet_balance || 0), 0),
                totalCashCollection: drivers.reduce((sum, d) => sum + (d.cashCollection || 0), 0),
                averageRating: drivers.reduce((sum, d) => sum + (parseFloat(d.rating) || 0), 0) / drivers.length || 0,
                recentRegistrations: 0, // Can't calculate from available data
                vehicleTypeBreakdown: drivers.reduce((acc, d) => {
                    const type = d.vehicle?.type || 'unknown';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {})
            };
            setStatistics(stats);
        }
    }, [drivers]);

    const openModal = (driver = null) => {
        setSelectedDriver(driver);
        setEditMode(!!driver);
        setIsModalOpen(true);
    };

    const closeModal = (refresh = false) => {
        setIsModalOpen(false);
        setSelectedDriver(null);
        if (refresh) fetchDrivers();
    };

    const onSettleSuccess = () => {
        console.log('onSettleSuccess called, refreshing drivers...');
        fetchDrivers()
    }

    const handleDelete = (driver) => {
        Modal.confirm({
            title: 'Delete Driver',
            content: `Are you sure you want to delete "${driver.name}"?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                // try {
                //     await deleteDriver(driver._id);
                //     message.success("Driver deleted successfully!");
                //     fetchDrivers();
                // } catch {
                //     message.error("Failed to delete driver.");
                // }
                message.error("Currently not working");
            }
        });
    };

    return (
        <>
            <div className='lg:px-10 px-5 my-8'>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'drivers',
                            label: 'Drivers Management',
                            children: (
                                <>
                                    {/* Statistics Cards */}
                                    <Row gutter={[16, 16]} className="mb-8">
                                        <Col xs={24} sm={12} md={6}>
                                            <Card>
                                                <Statistic
                                                    title="Total Drivers"
                                                    value={statistics.totalDrivers}
                                                    prefix={<RiEBike2Fill />}
                                                    valueStyle={{ color: '#1890ff' }}
                                                />
                                                {statistics.recentRegistrations && (
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        +{statistics.recentRegistrations} this month
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Card>
                                                <Statistic
                                                    title="Active Drivers"
                                                    value={statistics.activeDrivers}
                                                    prefix={<FaCheckCircle />}
                                                    valueStyle={{ color: '#52c41a' }}
                                                />
                                                {statistics.onDutyDrivers !== undefined && (
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        {statistics.onDutyDrivers} on duty
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Card>
                                                <Statistic
                                                    title="Verified Drivers"
                                                    value={statistics.verifiedDrivers || statistics.registeredDrivers}
                                                    prefix={<FaCheckCircle />}
                                                    valueStyle={{ color: '#722ed1' }}
                                                />
                                                {statistics.pendingVerification !== undefined && (
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        {statistics.pendingVerification} pending
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <Card>
                                                <Statistic
                                                    title="Blocked Drivers"
                                                    value={statistics.blockedDrivers}
                                                    prefix={<FaTimesCircle />}
                                                    valueStyle={{ color: '#f5222d' }}
                                                />
                                                {statistics.availableDrivers !== undefined && (
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        {statistics.availableDrivers} available
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Additional Statistics Row */}
                                    {(statistics.totalWalletBalance !== undefined || statistics.averageRating) && (
                                        <Row gutter={[16, 16]} className="mb-8">
                                            {statistics.totalWalletBalance !== undefined && (
                                                <Col xs={24} sm={12} md={8}>
                                                    <Card>
                                                        <Statistic
                                                            title="Total Wallet Balance"
                                                            value={statistics.totalWalletBalance}
                                                            prefix={<FaMoneyBillWave />}
                                                            precision={2}
                                                            valueStyle={{ color: '#52c41a' }}
                                                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                                        />
                                                    </Card>
                                                </Col>
                                            )}
                                            {statistics.totalCashCollection !== undefined && (
                                                <Col xs={24} sm={12} md={8}>
                                                    <Card>
                                                        <Statistic
                                                            title="Total Cash Collection"
                                                            value={statistics.totalCashCollection}
                                                            precision={2}
                                                            valueStyle={{ color: '#1890ff' }}
                                                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                                        />
                                                    </Card>
                                                </Col>
                                            )}
                                            {statistics.averageRating !== undefined && (
                                                <Col xs={24} sm={12} md={8}>
                                                    <Card>
                                                        <Statistic
                                                            title="Average Rating"
                                                            value={statistics.averageRating}
                                                            precision={1}
                                                            valueStyle={{ color: '#faad14' }}
                                                            formatter={(value) => `⭐ ${value}`}
                                                        />
                                                    </Card>
                                                </Col>
                                            )}
                                        </Row>
                                    )}

                                    {/* Vehicle Type Breakdown */}
                                    {statistics.vehicleTypeBreakdown && Object.keys(statistics.vehicleTypeBreakdown).length > 0 && (
                                        <Row gutter={[16, 16]} className="mb-8">
                                            <Col xs={24}>
                                                <Card title="Vehicle Type Distribution">
                                                    <Row gutter={[16, 16]}>
                                                        {Object.entries(statistics.vehicleTypeBreakdown).map(([type, count]) => (
                                                            <Col xs={12} sm={8} md={6} key={type}>
                                                                <Statistic
                                                                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                                                                    value={count}
                                                                    valueStyle={{ color: '#1890ff' }}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {/* Search Bar */}
                                    <div className='md:flex items-center gap-4 justify-between mb-6'>
                                        <Input.Search
                                            placeholder="Search by name, email, or mobile"
                                            onChange={(e) => setSearchText(e.target.value)}
                                            style={{ maxWidth: 400, borderRadius: '6px' }}
                                            size="large"
                                        />
                                        {/* <Button
                                            type="primary"
                                            icon={<FaPlus />}
                                            size="large"
                                            onClick={() => openModal()}
                                        >
                                            Add Driver
                                        </Button> */}
                                    </div>

                                    <DriverTable
                                        loading={loading}
                                        searchText={searchText}
                                        data={drivers}
                                        onEdit={openModal}
                                        onDelete={handleDelete}
                                        onSettleSuccess={onSettleSuccess}
                                    />

                                    {editMode ? (
                                        <EditDriverModal
                                            isModalOpen={isModalOpen}
                                            handleOk={() => closeModal(true)}
                                            handleCancel={() => closeModal(false)}
                                            driverData={selectedDriver}
                                        />
                                    ) : (
                                        <AddDriverModal
                                            isModalOpen={isModalOpen}
                                            handleOk={() => closeModal(true)}
                                            handleCancel={() => closeModal(false)}
                                        />
                                    )}
                                </>
                            )
                        },
                        {
                            key: 'wallet-requests',
                            label: 'Wallet Requests',
                            children: <WalletRequests />
                        }
                    ]}
                />
            </div>
        </>
    );
}

export default DriverManagement;
