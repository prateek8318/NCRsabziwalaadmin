import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { FaPlus } from 'react-icons/fa';
import DriverTable from './components/DriverTable';
import AddDriverModal from './components/AddDriverModel';
import EditDriverModal from './components/EditDriverModal';
import { getAllDrivers } from '../../../services/admin/apiDrivers'; // Assume these APIs exist

function DriverManagement() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await getAllDrivers();
            if (response?.status && Array.isArray(response.data)) {
                setDrivers(response.data);
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


    useEffect(() => { fetchDrivers() }, []);

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
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by driver name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
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
    );
}

export default DriverManagement;
