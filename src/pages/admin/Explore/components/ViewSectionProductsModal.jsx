import React from 'react';
import { Modal, List, Avatar, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

const ViewSectionProductsModal = ({
    open,
    onClose,
    section,
    onDeleteProduct,
    onAddProduct
}) => {
    const products = section?.products || [];

    return (
        <Modal
            title={`Products in "${section?.name}"`}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="add" icon={<PlusOutlined />} type="primary" onClick={onAddProduct}>
                    Add Product
                </Button>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            <List
                itemLayout="horizontal"
                dataSource={products}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Popconfirm
                                key="delete"
                                title="Delete this product?"
                                onConfirm={() => onDeleteProduct(section._id, item._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger type="link" icon={<DeleteOutlined />} />
                            </Popconfirm>
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

export default ViewSectionProductsModal;
