import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { updateCategory } from '../../../../services/apiCategory';
import dataURLtoFile from '../../../../utils/fileConverter';
import ImgCrop from 'antd-img-crop';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function EditCategoryModel({ isModalOpen, handleOk, handleCancel, categoryData }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (categoryData) {
            form.setFieldsValue({
                categoryName: categoryData.name,
            });
            setImageUrl(categoryData.image);
        }
    }, [categoryData, form]);

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return false;
        }
        return true;
    };

    const handleChange = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.categoryName);
        formData.append("type", "veg"); // Static type
        formData.append("serviceId", "67ecc79a20a93fc0b92a8b1b"); // Static serviceId

        // Only update if image changed
        if (imageUrl && imageUrl !== categoryData.image && imageUrl.startsWith("data:")) {
            const file = dataURLtoFile(imageUrl, "category.png");
            formData.append("image", file);
        }

        setLoading(true);
        try {
            await updateCategory(categoryData._id, formData);
            message.success('Category updated successfully!');
            form.resetFields();
            handleOk();
        } catch (error) {
            console.error(error);
            message.error('Error updating category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Category"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText="Update Category"
        >
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 600 }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[{ required: true, message: 'Please enter category name!' }, { pattern: /^[a-zA-Z0-9\- ]+$/, message: 'Only letters, numbers, hyphens (-), and spaces are allowed!' }]}
                >
                    <Input placeholder='Enter Category Name' />
                </Form.Item>

                <Form.Item label="Category Image" name="image">
                    <ImgCrop
                        rotationSlider
                        aspect={1}
                        quality={1}
                        modalTitle="Crop your category image"
                    >
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl.startsWith('data:') ? imageUrl : `${BASE_URL}/${imageUrl}`}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </ImgCrop>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Recommended Size: <strong>150 x 150 px</strong>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditCategoryModel;
