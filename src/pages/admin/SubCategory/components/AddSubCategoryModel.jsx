import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Upload, Select, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { addCategory, getAllCategory } from '@services/apiCategory';
import dataURLtoFile from '@utils/fileConverter';
import { useParams } from 'react-router';
import ImgCrop from 'antd-img-crop';

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AddSubCategoryModel({ isModalOpen, handleOk, handleCancel }) {
    const { categoryId } = useParams(); // get categoryId from URL

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategory();
                setCategories(res);
                const matchedCategory = res.find(cat => cat._id === categoryId);
                if (matchedCategory) {
                    form.setFieldsValue({ categoryName: matchedCategory._id });
                    setSelectedCategory(matchedCategory);
                }
            } catch (error) {
                console.log(error);
                message.error("Failed to load categories.");
            }
        };
        if (isModalOpen) {
            fetchCategories();
        }
    }, [isModalOpen]);

    const handleSubmit = async (values) => {
        if (!imageUrl) return message.error("Please upload a category image.");

        const file = dataURLtoFile(imageUrl, "subcategory.png");
        const formData = new FormData();
        formData.append("name", values.subcategoryName);
        formData.append("cat_id", values.categoryName);
        formData.append("image", file);

        try {
            setLoading(true);
            await addCategory(formData);
            message.success('Subcategory added successfully!');
            form.resetFields();
            setImageUrl(null);
            handleOk();
        } catch (error) {
            console.log(error);
            message.error('Failed to add sub category');
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
            title="Add Sub Category"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Add Sub Category"
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
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select disabled placeholder="Select a category">
                        {selectedCategory && (
                            <Option value={selectedCategory._id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar size="small" src={`${BASE_URL}/${selectedCategory.image}`} />
                                    <span>{selectedCategory.name}</span>
                                </div>
                            </Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Sub Category Name"
                    name="subcategoryName"
                    rules={[{ required: true, message: 'Please enter sub category name!' }]}
                >
                    <Input placeholder='Enter Sub Category Name' />
                </Form.Item>

                <Form.Item label="Sub Category Image">
                    <ImgCrop
                        rotationSlider
                        aspect={1}
                        quality={1}
                        modalTitle="Crop your subcategory image"
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
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddSubCategoryModel;
