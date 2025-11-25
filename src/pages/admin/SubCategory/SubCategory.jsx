import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, Tabs } from 'antd';
import { FaPlus } from 'react-icons/fa';
import SubCategoryTable from './components/SubCategoryTable';
import AddSubCategoryModel from './components/AddSubCategoryModel';
import EditSubCategoryModel from './components/EditSubCategoryModel';
import { deleteCategory, getAllSubCategory } from '../../../services/apiCategory';
import SetSubCategoryOrder from './components/SetSubCategoryOrder';
import { useParams } from 'react-router';

function SubCategory() {
    const { categoryId } = useParams();

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchSubcategories = async () => {
        setLoading(true);
        try {
            const data = await getAllSubCategory(categoryId);
            setSubcategories(data);
        } catch {
            message.error('Failed to load subcategories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, [categoryId]);

    const openModal = (category = null) => {
        setSelectedCategory(category);
        setEditMode(!!category);
        setIsModalOpen(true);
    };

    const closeModal = (updated = false) => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        if (updated) fetchSubcategories();
    };

    const handleDelete = (category) => {
        Modal.confirm({
            title: 'Delete Sub-Category',
            content: `Are you sure you want to delete "${category.name}"?`,
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteCategory(category._id);
                    message.success('Subcategory deleted successfully!');
                    fetchSubcategories();
                } catch {
                    message.error('Failed to delete subcategory.');
                }
            }
        });
    };

    const tabItems = [
        {
            key: 'list',
            label: 'Subcategory List',
            children: (
                <>
                    <div className="md:flex items-center justify-between gap-4 mb-4">
                        <Input.Search
                            placeholder="Search here ..."
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ maxWidth: 300, borderRadius: '6px' }}
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<FaPlus />}
                            size="large"
                            onClick={() => openModal()}
                        >
                            Add Sub Category
                        </Button>
                    </div>

                    <SubCategoryTable
                        loading={loading}
                        searchText={searchText}
                        data={subcategories}
                        onEdit={openModal}
                        onDelete={handleDelete}
                    />

                    {editMode ? (
                        <EditSubCategoryModel
                            isModalOpen={isModalOpen}
                            handleOk={() => closeModal(true)}
                            handleCancel={() => closeModal(false)}
                            categoryData={selectedCategory}
                            categoryId={categoryId}
                        />
                    ) : (
                        <AddSubCategoryModel
                            isModalOpen={isModalOpen}
                            handleOk={() => closeModal(true)}
                            handleCancel={() => closeModal(false)}
                            categoryId={categoryId}
                        />
                    )}
                </>
            )
        },
        {
            key: 'order',
            label: 'Set Order',
            children: <SetSubCategoryOrder />
        }
    ];

    return (
        <Tabs
            defaultActiveKey="list"
            className="px-4 md:px-10 my-6"
            items={tabItems}
        />
    );
}

export default SubCategory;
