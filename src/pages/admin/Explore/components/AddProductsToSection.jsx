// pages/AddProductsToSection.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAllVendorProducts, addProductsToExploreSection } from '../../services/admin/apiExplore';

const AddProductsToSection = () => {
    const { exploreSectionId } = useParams();
    const location = useLocation();
    const section = location.state?.section;
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await getAllVendorProducts();
            setProducts(data || []);
        } catch {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!selectedRowKeys.length) {
            return message.warning("Please select at least one product");
        }
        try {
            await addProductsToExploreSection({ exploreSectionId, productIds: selectedRowKeys });
            message.success("Products added successfully");
            navigate(-1); // Go back to previous page/modal
        } catch (err) {
            message.error("Failed to add products");
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Price', dataIndex: 'price' },
    ];

    return (
        <>
            <h2>Add Products to "{section?.name}"</h2>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                rowKey="_id"
                dataSource={products}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <Button type="primary" onClick={handleAdd}>Add Selected Products</Button>
        </>
    );
};

export default AddProductsToSection;
