import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, Tooltip, Table, message, Input, Button, Space } from 'antd';
import { useParams } from 'react-router';
import { deleteProductFromExploreSection, getSectionsByExplore } from '../../../../services/admin/apiExplore';
import { FaPlus } from 'react-icons/fa';
import AddSectionModal from './AddSectionModal';
import { EyeOutlined } from '@ant-design/icons';
import ViewSectionProductsModal from './ViewSectionProductsModal';
import AssignProductsToExploreSectionModal from './AssignProductsToExploreSectionModal';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

const ExploreSectionTable = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { exploreId } = useParams();

    const fetchSections = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const { data } = await getSectionsByExplore(id);
            setSections(data || []);
        } catch (err) {
            message.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections(exploreId);
    }, [exploreId]);

    const handleModalClose = () => setIsModalOpen(false);

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        fetchSections(exploreId);
    };

    const openViewModal = (section) => {
        setSelectedSection(section);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setSelectedSection(null);
        setIsViewModalOpen(false);
    };

    const handleDeleteProduct = async (exploreSectionId, productId) => {
        const data = { exploreSectionId, productId }
        // Implement API logic to remove product from section
        try {
            await deleteProductFromExploreSection(data);
            message.success("Product removed successfully");
            setSelectedSection((prevSection) => ({
                ...prevSection,
                products: prevSection.products.filter(
                    (product) => product._id !== productId
                ),
            }));
            fetchSections(exploreId);
        } catch (error) {
            // console.log(error)
            message.error("Something went wrong");
        }
    };

    const handleAddProduct = () => {
        setIsAssignModalOpen(true);
    };

    const handleAssignSuccess = () => {
        setIsAssignModalOpen(false);
        fetchSections(exploreId);
        if (selectedSection) {
            setSelectedSection(prev => ({ ...prev, products: [] })); // force refresh
        }
    };

    const columns = useMemo(() => [
        {
            title: 'Section Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Explore Name',
            dataIndex: ['exploreId', 'name'],
            key: 'exploreName',
            align: 'center',
            render: (_, record) => record.exploreId?.name || '—',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            align: 'center',
            render: (products = []) => (
                <Avatar.Group maxCount={5} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                    {products.map((product, index) => (
                        <Tooltip key={product._id || index} title={product.name} placement="top">
                            <Avatar
                                src={product.primary_image ? `${BASE_URL}/${product.primary_image}` : undefined}
                                shape="circle"
                                alt={product.name}
                            >
                                {product.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    ))}
                </Avatar.Group>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => openViewModal(record)}></Button>
                </Space>
            ),
        },
    ], []);

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by explore section name"
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                    disabled
                />
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Section
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={sections}
                rowKey="_id"
                pagination={false}
                loading={loading}
                scroll={{ x: true }}
                bordered
                size="middle"
            />

            <AddSectionModal
                isModalOpen={isModalOpen}
                handleCancel={handleModalClose}
                onSuccess={handleModalSuccess}
                exploreId={exploreId}
            />

            <ViewSectionProductsModal
                open={isViewModalOpen}
                onClose={handleCloseViewModal}
                section={selectedSection}
                onDeleteProduct={handleDeleteProduct}
                onAddProduct={handleAddProduct}
            />

            <AssignProductsToExploreSectionModal
                open={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                sectionId={selectedSection?._id}
                onSuccess={handleAssignSuccess}
            />

        </>
    );
};

export default ExploreSectionTable;
