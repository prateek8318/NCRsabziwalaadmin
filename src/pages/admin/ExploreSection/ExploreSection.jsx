import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, message, Select } from 'antd';
import { FaPlus } from 'react-icons/fa';
import SectionTable from './components/SectionTable';
import AddSectionModal from './components/AddSectionModal';
import { getAllExplore, getAllExploreProduct } from '../../../services/admin/apiExplore';


import { getSectionsByExplore, deleteSection, createSection } from '../../../services/admin/apiExplore';

function ExploreSection() {
    const [exploreList, setExploreList] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExploreId, setSelectedExploreId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchExploreList();
        fetchAllProducts();
    }, []);

    const fetchExploreList = async () => {
        try {
            const { data } = await getAllExplore();
            setExploreList(data || []);
        } catch (err) {
            message.error("Failed to load explores");
        }
    };

    const fetchAllProducts = async () => {
        try {
            const { data } = await getAllExploreProduct();
            setProductList(data || []);
        } catch (err) {
            message.error("Failed to load products");
        }
    };

    const fetchSections = async (exploreId) => {
        setLoading(true);
        try {
            const { data } = await getSectionsByExplore(exploreId);
            setSections(data || []);
        } catch (err) {
            message.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = ({ _id, name }) => {
        Modal.confirm({
            title: 'Delete Section',
            content: `Are you sure you want to delete "${name}"?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                try {
                    await deleteSection(_id);
                    message.success("Section deleted successfully!");
                    fetchSections(selectedExploreId);
                } catch {
                    message.error("Failed to delete section");
                }
            }
        });
    };

    const handleCreateSection = async (values) => {
        try {
            const payload = {
                name: values.name,
                products: values.products,
                exploreId: selectedExploreId,
            };
            const res = await createSection(payload);
            if (res.status) {
                message.success(res.message);
                fetchSections(selectedExploreId);
                setIsModalOpen(false);
            } else {
                message.error(res.message);
            }
        } catch {
            message.error("Failed to create section");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedExploreId(null);
    };

    const onSuccess = () => {
        setIsModalOpen(false);
        setSelectedExploreId(null);
        fetchExploreList()
    }

    return (
        <>
            <div className='lg:px-10 px-5 my-8 space-y-4'>
                <div className='flex items-center gap-4'>
                    <Select
                        placeholder="Select Explore"
                        style={{ minWidth: 250 }}
                        onChange={(id) => {
                            setSelectedExploreId(id);
                            fetchSections(id);
                        }}
                        options={exploreList.map(exp => ({ label: exp.name, value: exp._id }))}
                    />
                    <Input.Search
                        placeholder="Search section"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<FaPlus />}
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedExploreId}
                    >
                        Add Section
                    </Button>
                </div>

                <SectionTable
                    loading={loading}
                    data={sections}
                    searchText={searchText}
                    onDelete={handleDelete}
                />

                <AddSectionModal
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                    onSubmit={handleCreateSection}
                    products={productList}
                    onSuccess={onSuccess}
                />
            </div>
        </>
    );
}

export default ExploreSection;
