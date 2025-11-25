import React, { useEffect, useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Upload, message, Select, Row, Col
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProductDetail } from '@services/apiProduct';
import { addProductVarient } from '../../../../services/admin/apiProductVariant';
import ImgCrop from 'antd-img-crop';

const { Option } = Select;

const resizeImage = (file, size = 150) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                canvas.toBlob((blob) => {
                    const newFile = new File([blob], file.name, { type: file.type });
                    resolve(newFile);
                }, file.type);
            };
        };
    });
};

const AddProductVarientModal = ({ open, onClose, onSuccess, productId }) => {
    const [form] = Form.useForm();
    const [productInfo, setProductInfo] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (productId && open) {
            getProductDetail(productId)
                .then(data => setProductInfo(data))
                .catch(() => message.error("Failed to fetch product details"));
        }
    }, [productId, open]);

    const handlePriceChange = () => {
        const originalPrice = form.getFieldValue('originalPrice');
        const price = form.getFieldValue('price');
        if (originalPrice && price) {
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            form.setFieldsValue({ discount: discount > 0 ? discount : 0 });
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("name", values.name);
            formData.append("unit", values.unit);
            formData.append("price", values.price);
            formData.append("originalPrice", values.originalPrice);
            formData.append("discount", values.discount);

            setUploading(true);
            for (const file of fileList) {
                const original = file.originFileObj || file;
                const cropped = await resizeImage(original, 150);
                formData.append("images", cropped);
            }

            await addProductVarient(productId, formData);
            message.success('Variant added successfully!');
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error) {
            console.error('Submit failed:', error);
            message.error('Failed to add variant');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            title="Add New Product Variant"
            open={open}
            confirmLoading={uploading}
            onCancel={() => {
                form.resetFields();
                setFileList([]);
                onClose();
            }}
            onOk={handleSubmit}
            okText="Save"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Product Name">
                    <Input value={productInfo?.name || ''} disabled />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Category">
                            <Input value={productInfo?.categoryId?.name || ''} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Subcategory">
                            <Input value={productInfo?.subCategoryId?.name || ''} disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Variant Name"
                    name="name"
                    rules={[{ required: true, message: 'Enter variant name' }, { pattern: /^[a-zA-Z0-9\- ]+$/, message: 'Only letters, numbers, hyphens (-), and spaces are allowed!' }]}
                >
                    <Input placeholder="e.g. 500g, 1kg" />
                </Form.Item>

                <Form.Item
                    label="Unit"
                    name="unit"
                    rules={[{ required: true, message: 'Enter unit' }]}
                >
                    <Select placeholder="Select unit">
                        <Option value="kg">kg</Option>
                        <Option value="g">g</Option>
                        <Option value="ltr">ltr</Option>
                        <Option value="ml">ml</Option>
                        <Option value="pcs">pcs</Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Original Price"
                            name="originalPrice"
                            rules={[{ required: true, message: 'Enter original price' }, { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' }]}
                        >
                            <InputNumber
                                min={0}
                                onChange={handlePriceChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Selling Price"
                            name="price"
                            rules={[{ required: true, message: 'Enter selling price' }, { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' }]}
                        >
                            <InputNumber
                                min={0}
                                onChange={handlePriceChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Discount (%)" name="discount">
                            <InputNumber disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Upload Variant Images ( 5 images max )">
                    <ImgCrop
                        rotationSlider
                        quality={1}
                        aspect={1}
                        modalTitle="Crop Image to 150 x 150"
                        showReset
                        showGrid
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            beforeUpload={() => false}
                            multiple
                        >
                            {fileList.length < 5 && (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
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
};

export default AddProductVarientModal;
