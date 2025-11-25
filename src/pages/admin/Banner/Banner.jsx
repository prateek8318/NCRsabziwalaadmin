import { Breadcrumb, Button, Card, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaPlus } from 'react-icons/fa';
import BannerTable from './components/BannerTable';
import AddBannerModel from './components/AddBannerModel';
import EditBannerModel from './components/EditBannerModel';
import { deleteBanner, getAllBanner } from '../../../services/admin/apiBanner';

function MainBanner() {
    const [banner, setBanner] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedBanner, setSelectedBanner] = useState(null);

    const fetchBanner = async () => {
        setLoading(true);
        try {
            const res = await getAllBanner();
            setBanner(res.data);
            // console.log(banner)
        } catch {
            message.error("Failed to load banner.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanner(); }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        fetchBanner();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showEditModal = (banner) => {
        setSelectedBanner(banner);
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        setIsEditModalOpen(false);
        setSelectedBanner(null);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedBanner(null);
    };

    const handleDelete = (banner) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this banner?',
            content: `This will permanently delete "${banner.title}"`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                try {
                    await deleteBanner(banner._id)
                    fetchBanner()
                    message.success("Banner deleted successfully")
                } catch (error) {
                    console.log(error)
                }
            },
        });
    };

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by title"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        maxWidth: 300,
                        borderRadius: '6px'
                    }}
                    size="large"
                />
                <Button
                    type='primary'
                    icon={<FaPlus />}
                    size="large"
                    className="hover:opacity-90 transition-all duration-300"
                    onClick={showModal}
                >
                    Add Banner
                </Button>
            </div>
            <BannerTable
                searchText={searchText}
                data={banner}
                onEdit={showEditModal}
                onDelete={handleDelete}
                loading={loading}
            />

            {/* Add Banner Modal */}
            <AddBannerModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            {/* Edit Banner Modal */}
            <EditBannerModel
                isModalOpen={isEditModalOpen}
                handleOk={handleEditOk}
                handleCancel={handleEditCancel}
                bannerData={selectedBanner}
            />
        </>
    );
}

export default MainBanner; 