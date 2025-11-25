import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { addBanner } from '../../../../services/admin/apiBanner';
// import { addBanner } from '../../../../services/admin/apiBanner';

const AddBannerModel = ({ isModalOpen, handleOk, handleCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const sectionOptions = [
        { value: 'section1', label: 'Section 1' },
        { value: 'section2', label: 'Section 2' },
    ];

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

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onFinish = async (values) => {
        if (fileList.length === 0) {
            message.error("Please upload a banner image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("section", values.chooeseSection);
        formData.append("serviceId", "67ecc79a20a93fc0b92a8b1b"); // Static serviceId
        formData.append("image", fileList[0].originFileObj);

        try {
            setLoading(true);
            await addBanner(formData); // your actual API call
            message.success('Banner added successfully!');
            form.resetFields();
            setFileList([]);
            handleOk();
        } catch (error) {
            console.error(error);
            message.error("Failed to add banner.");
        } finally {
            setLoading(false);
        }
    };


    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const onCancel = () => {
        form.resetFields();
        setFileList([]);
        handleCancel();
    };

    return (
        <Modal
            title="Add New Banner"
            open={isModalOpen}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={form.submit}
                    loading={loading}
                    disabled={fileList.length === 0}
                >
                    Add Banner
                </Button>
            ]}
            destroyOnHidden
        >
            <Form
                form={form}
                name="addBanner"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Banner Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the banner title!' }, { pattern: /^[a-zA-Z0-9\- ]+$/, message: 'Only letters, numbers, hyphens (-), and spaces are allowed!' }]}
                >
                    <Input placeholder="Enter banner title" />
                </Form.Item>

                <Form.Item
                    label="Choose Section"
                    name="chooeseSection"
                    rules={[{ required: true, message: 'Please select a section!' }]}
                >
                    <Select placeholder="Select section" options={sectionOptions} />
                </Form.Item>

                <Form.Item
                    label="Banner Image"
                >
                    <div>
                        <ImgCrop
                            rotationSlider
                            aspect={320 / 150}
                            quality={1}
                            modalTitle="Crop your banner"
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={beforeUpload}
                                onChange={onChange}
                                onPreview={onPreview}
                                showUploadList={{ showRemoveIcon: true }}
                                customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </ImgCrop>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            Recommended Size: <strong>320 x 150 px</strong>
                        </div>
                    </div>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default AddBannerModel;

