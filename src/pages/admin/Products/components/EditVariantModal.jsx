import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, message, Select, Row, Col } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteProductVarientImage, updateProductVarient } from '../../../../services/admin/apiProductVariant';
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

const EditVariantModal = ({ visible, onClose, onSave, variant, productId }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (visible && variant) {
            form.setFieldsValue({
                name: variant.name,
                unit: variant.unit,
                price: variant.price,
                originalPrice: variant.originalPrice,
                discount: variant.discount,
            });

            const files = variant.images?.map((img, idx) => ({
                uid: `${idx}`,
                name: `Image-${idx + 1}`,
                url: `${BASE_URL}/${img}`,
                status: 'done',
            })) || [];

            setFileList(files);
        }
    }, [visible, variant, form, BASE_URL]);

    const handlePriceChange = () => {
        const original = form.getFieldValue('originalPrice');
        const price = form.getFieldValue('price');
        if (original && price >= 0) {
            const discount = Math.round(((original - price) / original) * 100);
            form.setFieldsValue({ discount: discount > 0 ? discount : 0 });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('name', values.name);
            formData.append('unit', values.unit);
            formData.append('price', values.price);
            formData.append('originalPrice', values.originalPrice);
            formData.append('discount', values.discount);

            setUploading(true);

            for (const file of fileList) {
                if (file.originFileObj) {
                    const resized = await resizeImage(file.originFileObj, 150);
                    formData.append('images', resized);
                }
            }

            await updateProductVarient(productId, variant._id, formData);
            message.success('Variant updated successfully!');
            onSave(values);
            onClose();
        } catch (err) {
            console.error('Update failed', err);
            message.error('Failed to update variant');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (file) => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: 'Are you sure you want to delete this image?',
                icon: <ExclamationCircleOutlined />,
                content: 'This action cannot be undone.',
                okText: 'Yes, delete it',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        const imageUrl = file.url || '';
                        const imagePath = imageUrl.replace(`${BASE_URL}/`, '').replace(/\//g, '\\');
                        await deleteProductVarientImage(productId, variant._id, imagePath);
                        setFileList(prev => prev.filter(img => img.uid !== file.uid));
                        message.success('Image deleted');
                        resolve(true);
                    } catch (err) {
                        console.error(err);
                        message.error('Failed to delete image');
                        reject(err);
                    }
                },
                onCancel: () => reject(),
            });
        });
    };

    return (
        <Modal
            title="Edit Product Variant"
            open={visible}
            onOk={handleOk}
            confirmLoading={uploading}
            onCancel={onClose}
            okText="Update"
            cancelText="Cancel"
            forceRender
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Variant Name" name="name" rules={[{ required: true, message: 'Enter variant name' }, { pattern: /^[a-zA-Z0-9\- ]+$/, message: 'Only letters, numbers, hyphens (-), and spaces are allowed!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
                    <Select>
                        <Option value="kg">kg</Option>
                        <Option value="g">g</Option>
                        <Option value="ltr">ltr</Option>
                        <Option value="ml">ml</Option>
                        <Option value="pcs">pcs</Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Original Price" name="originalPrice" rules={[{ required: true }]}>
                            <InputNumber min={0} onChange={handlePriceChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Selling Price" name="price" rules={[{ required: true }]}>
                            <InputNumber min={0} onChange={handlePriceChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Discount (%)" name="discount">
                            <InputNumber disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Images ( 5 images max )">
                    <ImgCrop
                        aspect={1}
                        rotationSlider
                        quality={1}
                        modalTitle="Crop to 150 x 150"
                        cropShape="rect"
                        showReset
                        showGrid
                        minZoom={1}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onRemove={handleRemoveImage}
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

export default EditVariantModal;
