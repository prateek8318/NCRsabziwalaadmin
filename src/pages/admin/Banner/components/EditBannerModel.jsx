import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';

const EditBannerModel = ({ isModalOpen, handleOk, handleCancel, bannerData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

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
        return false;
    };

    const handleChange = (info) => {
        if (info.file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        if (bannerData) {
            form.setFieldsValue({
                title: bannerData.title,
                image: bannerData.image,
                status: bannerData.status
            });
        }
    }, [bannerData, form]);

    const onFinish = (values) => {
        // console.log('Success:', values);
        // Here you would typically make an API call to update the banner
        handleOk();
    };

    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    return (
        <Modal
            title="Edit Banner"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit}>
                    Update Banner
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="editBanner"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Form.Item
                    label="Banner Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the banner title!' }]}
                >
                    <Input placeholder="Enter banner title" />
                </Form.Item>
                <Form.Item
                    label="Service Type"
                    name="serviceType"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Service Type"
                        optionFilterProp="label"
                        options={[
                            { value: 'food', label: 'Food' },
                            { value: 'grocery', label: 'Grocery' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Chooese Section"
                    name="chooeseSection"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Chooese Section"
                        optionFilterProp="label"
                        options={[
                            { value: 'homeFood', label: 'Home (Food)' },
                            { value: 'offerFood', label: 'Offer (Food)' },
                            { value: 'b1g1Food', label: 'Buy 1 Get 1 Free (Food)' },
                            { value: 'nightCafeGrocery', label: 'Night Cafe (Food)' },
                            { value: 'homeGrocery', label: 'Home (Grocery)' },
                            { value: 'store199Grocery', label: '199 Store (Grocery)' },
                            { value: 'everydayGrocery', label: 'Everyday (Grocery)' },
                            { value: 'offerGrocery', label: 'Offer (Grocery)' },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Category Image" name="image" >
                    <Upload
                        name="image"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
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
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditBannerModel; 