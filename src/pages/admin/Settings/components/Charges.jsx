import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Breadcrumb, Spin, Row, Col } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { getAllSettings, updateSettings } from '../../../../services/apiSettings';
import TextArea from 'antd/es/input/TextArea';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Charges() {
    const [settingData, setSettingData] = useState({})
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

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

    const fetchSetting = async () => {
        try {
            const data = await getAllSettings();
            setSettingData(data.data.settings[0])
            setImageUrl(`${BASE_URL}/${data.data.settings[0].logo}`)
        } catch (error) {
            console.log(error)
            message.error("Failed to load settings.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSetting() }, [])

    const handleChange = (info) => {
        if (info.file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    const onFinish = async (values) => {
        setUpdateLoading(true)
        const formData = new FormData();
        formData.append("brandName", values.brandName);
        formData.append("commission", values.commission);
        formData.append("gst", values.gst);
        formData.append("onboardingFee", values.onboardingfee);
        formData.append("plateformFee", values.plateformFee);
        formData.append("finialPlateformFee", values.finialPlateformFee);
        formData.append("email", values.email);
        formData.append("mobile", values.mobile);
        formData.append("address", values.address);
        formData.append("googleMapApiKey", values.googleMapApiKey);
        formData.append("razorpayKeyId", values.razorpayKeyId);
        formData.append("razorpayKeySecret", values.razorpayKeySecret);

        if (values.image && values.image.file) {
            formData.append("image", values.image.file);
        }

        try {
            await updateSettings(settingData._id, formData);
            message.success('Settings updated successfully!');
        } catch (error) {
            console.log(error)
            message.error('Error updating settings');
        } finally {
            setUpdateLoading(false)
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Manage Settings</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        brandName: settingData.brandName,
                        commission: settingData.commission,
                        gst: settingData.gst,
                        onboardingfee: settingData.onboardingFee,
                        logo: settingData.logo,
                        email: settingData.email,
                        mobile: settingData.mobile,
                        address: settingData.address,
                        plateformFee: settingData.plateformFee,
                        finialPlateformFee: settingData.finialPlateformFee,
                        googleMapApiKey: settingData.googleMapApiKey,
                        razorpayKeyId: settingData.razorpayKeyId,
                        razorpayKeySecret: settingData.razorpayKeySecret,
                    }}
                    className="max-w-2xl"
                >
                    {/* site details */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Site Name"
                                name="brandName"
                                rules={[{ required: true, message: 'Please enter brand name' }]}
                            >
                                <Input placeholder="Enter brand name" size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Site Logo" name="image" >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    fileList={imageUrl ? [{ url: imageUrl }] : []}
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
                        </Col>
                    </Row>

                    {/* commission manage */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Commission (%)"
                                name="commission"
                                rules={[{ required: true, message: 'Please enter commission' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    style={{ width: '100%' }}
                                    placeholder="Enter commission percentage"
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="GST (%)"
                                name="gst"
                                rules={[{ required: true, message: 'Please enter commission' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    style={{ width: '100%' }}
                                    placeholder="Enter commission percentage"
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Onboarding Fee"
                                name="onboardingfee"
                                rules={[{ required: true, message: 'Please enter onboarding fee' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter Onboarding Fee"
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* plateform fee */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="plateformFee"
                                label="Plateform Fee"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }}
                                    onChange={(value) => {
                                        const gst = value * 0.18;
                                        form.setFieldsValue({
                                            plateformFeegst: 18,
                                            finialPlateformFee: Math.round(value + gst),
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="plateformFeegst"
                                label="GST (%)"
                                initialValue={18}
                            >
                                <InputNumber variant='filled' readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="finialPlateformFee"
                                label="Final Plateform fee"
                                rules={[{ required: true }]}
                            >
                                <InputNumber variant='filled' readOnly style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* site manage */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please enter email' }]}
                            >
                                <Input placeholder="Enter Email" size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Mobile No"
                                name="mobile"
                                rules={[{ required: true, message: 'Please enter mobile no' }, { pattern: /^[0-9]+$/, message: 'Only numbers are allowed!' }]}
                            >
                                <Input placeholder="Enter Mobile No." size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please enter address' }]}
                            >
                                {/* <Input placeholder="Enter Address" size='large' /> */}
                                <TextArea rows={5} placeholder="Enter Term and Conditions here ..." required />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* google map api key setting */}
                    <Form.Item
                        label="Google Map Api"
                        name="googleMapApiKey"
                        rules={[{ required: true, message: 'Please enter google map api key' }]}
                    >
                        <Input placeholder="Enter google map api" size='large' disabled />
                    </Form.Item>

                    {/* razorpay api key setting */}
                    <Form.Item
                        label="Razorpay Api Id"
                        name="razorpayKeyId"
                        rules={[{ required: true, message: 'Please enter razorpay key id' }]}
                    >
                        <Input placeholder="Enter razorpay key id" size='large' disabled />
                    </Form.Item>

                    {/* razorpay api key setting */}
                    <Form.Item
                        label="Razorpay Api Secret"
                        name="razorpayKeySecret"
                        rules={[{ required: true, message: 'Please enter razorpay key secret' }]}
                    >
                        <Input placeholder="Enter razorpay key secret" size='large' disabled />
                    </Form.Item>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Site Name"
                            name="brandName"
                            rules={[{ required: true, message: 'Please enter brand name' }]}
                        >
                            <Input placeholder="Enter brand name" size='large' />
                        </Form.Item>

                        <Form.Item label="Site Logo" name="image" >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                fileList={imageUrl ? [{ url: imageUrl }] : []}
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

                        <Form.Item
                            label="Commission (%)"
                            name="commission"
                            rules={[{ required: true, message: 'Please enter commission' }]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                style={{ width: '100%' }}
                                placeholder="Enter commission percentage"
                                size='large'
                            />
                        </Form.Item>

                        <Form.Item
                            label="GST (%)"
                            name="gst"
                            rules={[{ required: true, message: 'Please enter gst' }]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                style={{ width: '100%' }}
                                placeholder="Enter gst percentage"
                                size='large'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Onboarding Fee"
                            name="onboardingfee"
                            rules={[{ required: true, message: 'Please enter onboarding fee' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter Onboarding Fee"
                                size='large'
                            />
                        </Form.Item>

                    </div> */}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" loading={updateLoading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default Charges;
