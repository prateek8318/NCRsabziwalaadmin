import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createExploreSection, getAllExplore, getAllExploreProduct } from '../../../../services/admin/apiExplore';

const AddSectionModal = ({ isModalOpen, handleCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [explores, setExplores] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDropdownData = async () => {
        try {
            const [exploreRes, productRes] = await Promise.all([getAllExplore(), getAllExploreProduct()]);
            if (exploreRes.status) setExplores(exploreRes.data);
            if (productRes.status) setProducts(productRes.data);
        } catch (err) {
            message.error('Failed to load dropdown options');
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchDropdownData();
        }
    }, [isModalOpen]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                exploreId: values.exploreId,
                products: values.products,
            };
            const res = await createExploreSection(payload);
            message.success('Section created');
            form.resetFields();
            onSuccess();
        } catch (err) {
            // console.log(err)
            message.error('Failed to create section');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Explore Section"
            open={isModalOpen}
            onCancel={() => {
                form.resetFields();
                handleCancel();
            }}
            onOk={() => form.submit()}
            okText="Create"
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="name"
                    label="Section Name"
                    rules={[{ required: true, message: 'Please enter section name' }]}
                >
                    <Input placeholder="e.g. Recommended Products" />
                </Form.Item>

                <Form.Item
                    name="exploreId"
                    label="Select Explore"
                    rules={[{ required: true, message: 'Please select an explore item' }]}
                >
                    <Select placeholder="Choose an explore item">
                        {explores.map((exp) => (
                            <Select.Option key={exp._id} value={exp._id}>
                                {exp.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="products"
                    label="Select Products"
                    rules={[{ required: true, message: 'Please select products' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Choose multiple products"
                        optionFilterProp="children"
                        showSearch
                    >
                        {products.map((prod) => (
                            <Select.Option key={prod._id} value={prod._id}>
                                {prod.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSectionModal;
