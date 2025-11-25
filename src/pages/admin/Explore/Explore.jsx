import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { FaPlus } from 'react-icons/fa';
import ExploreTable from './components/ExploreTable';
import AddExploreModal from './components/AddExploreModel';
import EditExploreModal from './components/EditExploreModal';
import { getAllExplore, deleteExplore, detailsExplore, updateExplore } from '../../../services/admin/apiExplore';

function Explore() {
    const [explore, setExplore] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedExplore, setSelectedExplore] = useState(null);

    const fetchExplore = async () => {
        setLoading(true);
        try {
            const { status, data } = await getAllExplore();
            setExplore(status && Array.isArray(data) ? data : []);
            if (!status || !Array.isArray(data)) message.warning("No explore items found.");
        } catch (err) {
            console.error("Error fetching explore:", err);
            message.error("Failed to load explore items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExplore() }, []);

    const openModal = async (item = null) => {
        if (item) {
            setLoading(true);
            try {
                const { data } = await detailsExplore(item._id);
                setSelectedExplore(data);
                setEditMode(true);
            } catch {
                message.error("Failed to load explore details.");
            } finally {
                setLoading(false);
            }
        } else {
            setSelectedExplore(null);
            setEditMode(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = (refresh = false) => {
        setIsModalOpen(false);
        setSelectedExplore(null);
        if (refresh) fetchExplore();
    };

    const handleDelete = ({ _id, name }) => {
        Modal.confirm({
            title: 'Delete Explore Item',
            content: `Are you sure you want to delete "${name}"?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                try {
                    await deleteExplore(_id);
                    message.success("Explore item deleted successfully!");
                    fetchExplore();
                } catch {
                    message.error("Failed to delete explore item.");
                }
            }
        });
    };

    const handleUpdateExplore = async (id, formData) => {
        try {
            const res = await updateExplore(id, formData);
            res?.status ? message.success(res.message || 'Updated.') : message.error(res?.message || 'Failed.');
            if (res?.status) closeModal(true);
        } catch {
            message.error('Failed to update explore item.');
        }
    };

    const onView = (record) => {
        // console.log(record)
    }

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by explore name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                />
                <Button type="primary" icon={<FaPlus />} size="large" onClick={() => openModal()}>Add Explore</Button>
            </div>

            <ExploreTable
                loading={loading}
                searchText={searchText}
                data={explore}
                onEdit={openModal}
                onView={onView}
                onDelete={handleDelete}
            />

            {editMode ? (
                <EditExploreModal
                    isModalOpen={isModalOpen}
                    handleCancel={() => closeModal(false)}
                    exploreData={selectedExplore}
                    onSubmit={handleUpdateExplore}
                />
            ) : (
                <AddExploreModal
                    isModalOpen={isModalOpen}
                    handleOk={() => closeModal(true)}
                    handleCancel={() => closeModal(false)}
                    fetchExplore={fetchExplore}
                />
            )}
        </>
    );
}

export default Explore;
