import React, { useState } from 'react';
import { Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { addCategory, getAllCategory } from '@services/apiCategory';
import dataURLtoFile from '@utils/fileConverter';

function AddCategoryModel({ isModalOpen, handleOk, handleCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    // Validate image before upload
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

    // Convert cropped file to data URL and store for preview + upload
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
        if (!imageUrl) {
            return message.error("Please upload a category image.");
        }

        const file = dataURLtoFile(imageUrl, "category.png");
        const formData = new FormData();
        formData.append("name", values.categoryName);
        formData.append("type", "veg"); // Static type
        formData.append("serviceId", "67ecc79a20a93fc0b92a8b1b"); // Static serviceId
        formData.append("image", file);

        try {
            setLoading(true);
            await addCategory(formData);
            message.success('Category added successfully!');
            form.resetFields();
            setImageUrl(null);
            handleOk();
            getAllCategory();
        } catch (error) {
            console.error(error);
            message.error("Failed to add category.");
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setImageUrl(null);
        handleCancel();
    };

    return (
        <Modal
            title="Add Category"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Add Category"
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[{ required: true, message: 'Please enter category name!' }, { pattern: /^[a-zA-Z0-9\- ]+$/, message: 'Only letters, numbers, hyphens (-), and spaces are allowed!' }]}
                >
                    <Input placeholder='Enter New Category Name' />
                </Form.Item>

                <Form.Item label="Category Image">
                    <div>
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
                                        src={imageUrl}
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
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddCategoryModel;
