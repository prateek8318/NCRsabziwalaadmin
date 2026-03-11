import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, message, Row, Col, Upload, Tag } from 'antd';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaCamera, FaLock, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

function MyAccount() {
    const { admin, setAdmin } = useAuth();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/profile');
            // ✅ response.data.data ya response.data direct — dono handle karo
            const data = response.data?.data || response.data;
            if (data && data._id) {
                setProfileData(data);
                form.setFieldsValue({
                    name:  data.name  || '',
                    email: data.email || ''
                });
                if (setAdmin) setAdmin(prev => ({ ...prev, ...data }));
            } else {
                message.error('Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            message.error('Failed to load profile');
        }
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        form.setFieldsValue({
            name:  profileData?.name  || '',
            email: profileData?.email || ''
        });
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.patch('/api/admin/profile', values);
            if (response.data.success) {
                message.success('Profile updated successfully!');
                setEditMode(false);
                const updatedData = { ...profileData, ...values };
                setProfileData(updatedData);
                form.setFieldsValue({ name: updatedData.name, email: updatedData.email });
                if (setAdmin) setAdmin(prev => ({ ...prev, ...updatedData }));
            } else {
                message.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values) => {
        setPasswordLoading(true);
        try {
            const response = await axiosInstance.patch('/api/admin/change-password', {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            if (response.data.success) {
                message.success('Password changed successfully!');
                passwordForm.resetFields();
            } else {
                message.error(response.data.message || 'Failed to change password');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleImageUpload = async (info) => {
        const { file } = info;
        if (!file) return;

        if (!file.type?.startsWith('image/')) {
            message.error('Please upload an image file');
            return;
        }
        if (file.size / 1024 / 1024 >= 5) {
            message.error('Image must be smaller than 5MB');
            return;
        }

        setImageLoading(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await axiosInstance.patch('/api/admin/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success || response.data.status === true) {
                message.success('Profile image updated successfully!');
                const newImage =
                    response.data.data?.image ||
                    response.data.data?.avatar ||
                    response.data.data?.profileImage;
                const updatedData = { ...profileData, image: newImage };
                setProfileData(updatedData);
                if (setAdmin) setAdmin(prev => ({ ...prev, image: newImage }));
            } else {
                message.error(response.data.message || 'Failed to upload image');
            }
        } catch (error) {
            if (error.response?.status === 413) message.error('File too large');
            else if (error.response?.status === 400) message.error(error.response?.data?.message || 'Invalid file');
            else message.error('Failed to upload image');
        } finally {
            setImageLoading(false);
        }
    };

    // Loading state
    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div>Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* ── Profile Card ── */}
            <Card
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">My Account</span>
                        <div className="space-x-2">
                            {!editMode ? (
                                <Button type="primary" icon={<FaEdit />} onClick={handleEdit}>
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button type="primary" icon={<FaSave />} loading={loading} onClick={() => form.submit()}>
                                        Save
                                    </Button>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                </>
                            )}
                        </div>
                    </div>
                }
                className="max-w-4xl mx-auto shadow-lg"
            >
                <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
                    <Row gutter={24}>

                        {/* Avatar Section */}
                        <Col xs={24} md={8}>
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <Avatar
                                        size={120}
                                        src={
                                            profileData.image
                                                ? `${import.meta.env.VITE_BASE_URL}/${profileData.image}`
                                                : undefined
                                        }
                                        icon={<FaUser />}
                                        style={{ backgroundColor: '#1890ff', fontSize: '48px' }}
                                    />
                                    <div className="absolute bottom-0 right-0">
                                        <Upload
                                            accept="image/*"
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={handleImageUpload}
                                        >
                                            <Button icon={<FaCamera />} loading={imageLoading} disabled={imageLoading} size="small">
                                                {imageLoading ? 'Uploading...' : 'Change Photo'}
                                            </Button>
                                        </Upload>
                                    </div>
                                </div>

                                {/* ✅ Live update hoga jab name save ho */}
                                <h3 className="text-lg font-semibold mt-10 mb-1">
                                    {profileData.name || 'Admin User'}
                                </h3>
                                <Tag color="blue" className="mt-1">Administrator</Tag>
                            </div>

                            {/* Read-only info */}
                            <div className="text-sm text-gray-500 space-y-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="text-gray-400" />
                                    <span>Joined: {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="text-gray-400" />
                                    <span>Updated: {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                </div>
                            </div>
                        </Col>

                        {/* ✅ Sirf name aur email — actual schema fields */}
                        <Col xs={24} md={16}>
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[
                                    { required: true, message: 'Please enter your name' },
                                    { min: 3, message: 'Name must be at least 3 characters' },
                                    { max: 50, message: 'Name cannot exceed 50 characters' },
                                    { pattern: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' }
                                ]}
                            >
                                <Input
                                    prefix={<FaUser className="text-gray-400" />}
                                    size="large"
                                    disabled={!editMode}
                                    placeholder="Enter your full name"
                                    maxLength={50}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                    { max: 100, message: 'Email cannot exceed 100 characters' }
                                ]}
                            >
                                <Input
                                    prefix={<FaEnvelope className="text-gray-400" />}
                                    size="large"
                                    disabled={!editMode}
                                    placeholder="Enter your email"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* ── Change Password Card ── */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FaLock className="text-gray-500" />
                        <span className="text-lg font-semibold">Change Password</span>
                    </div>
                }
                className="max-w-4xl mx-auto shadow-lg"
            >
                <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange} className="max-w-md">
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                        <Input.Password
                            prefix={<FaLock className="text-gray-400" />}
                            size="large"
                            placeholder="Enter current password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter new password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                            { max: 32, message: 'Password cannot exceed 32 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<FaLock className="text-gray-400" />}
                            size="large"
                            placeholder="Enter new password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                                    return Promise.reject('Passwords do not match');
                                }
                            })
                        ]}
                    >
                        <Input.Password
                            prefix={<FaLock className="text-gray-400" />}
                            size="large"
                            placeholder="Confirm new password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={passwordLoading} icon={<FaSave />}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default MyAccount;