import React, { useEffect, useState } from 'react';
import { Modal, List, Checkbox, Avatar, Button, message } from 'antd';
import { assignProductsToExploreSection, getAllExploreProduct } from '../../../../services/admin/apiExplore';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

const AssignProductsToExploreSectionModal = ({ open, onClose, sectionId, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const { data } = await getAllExploreProduct();
            setProducts(data || []);
        } catch (err) {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (open) {
            fetchProducts();
            setSelectedIds([]);
        }
    }, [open]);

    const handleAssign = async () => {
        try {
            await assignProductsToExploreSection({
                exploreSectionId: sectionId,
                productIds: selectedIds
            });
            message.success("Products assigned successfully");
            onSuccess(); // refresh section details
        } catch (err) {
            message.error("Failed to assign products");
        }
    };

    const toggleProduct = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    return (
        <Modal
            open={open}
            title="Assign Products to Section"
            onCancel={onClose}
            onOk={handleAssign}
            okText="Assign"
            confirmLoading={loading}
        >
            <List
                itemLayout="horizontal"
                dataSource={products}
                loading={loading}
                pagination={{
                    pageSize: 7,
                    showSizeChanger: false,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Checkbox
                                checked={selectedIds.includes(item._id)}
                                onChange={() => toggleProduct(item._id)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.primary_image ? `${BASE_URL}/${item.primary_image}` : undefined}>{item.name?.[0]}</Avatar>}
                            title={item.name}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default AssignProductsToExploreSectionModal;
