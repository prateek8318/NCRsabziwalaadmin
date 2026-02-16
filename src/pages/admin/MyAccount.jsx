import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, message, Divider, Row, Col, Upload } from 'antd';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const { TextArea } = Input;

function MyAccount() {
    const { user, setUser } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/profile');
            console.log('Profile API response:', response.data);
            
            if (response.data.success) {
                const data = response.data.data;
                setProfileData(data);
                form.setFieldsValue({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || data.mobileNo || '',
                    address: data.address || '',
                    bio: data.bio || ''
                });
                
                // Update user context if needed
                if (setUser) {
                    setUser(prev => ({ ...prev, ...data }));
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            message.error('Failed to load profile');
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        // Reset form to original values
        form.setFieldsValue({
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || profileData.mobileNo || '',
            address: profileData.address || '',
            bio: profileData.bio || ''
        });
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.patch('/api/admin/profile', values);
            console.log('Profile update response:', response.data);
            
            if (response.data.success) {
                message.success('Profile updated successfully!');
                setEditMode(false);
                
                // Update local profile data
                const updatedData = { ...profileData, ...values };
                setProfileData(updatedData);
                
                // Update user context
                if (setUser) {
                    setUser(prev => ({ ...prev, ...updatedData }));
                }
            } else {
                message.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (info) => {
        const { file } = info;
        
        if (!file) return;
        
        console.log('Starting image upload:', file);
        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        });
        
        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB');
            return;
        }

        setImageLoading(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            console.log('Sending request to /api/admin/profile-image');
            const response = await axiosInstance.patch('/api/admin/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Image upload response:', response.data);
            console.log('Response status:', response.status);
            console.log('Response data structure:', response.data);
            
            if (response.data.status === true || response.data.success === true) {
                message.success('Profile image updated successfully!');
                
                // Update profile data with new image
                const updatedData = { 
                    ...profileData, 
                    avatar: response.data.data.avatar || response.data.data.profileImage || response.data.data.image
                };
                setProfileData(updatedData);
                
                // Update user context
                if (setUser) {
                    setUser(prev => ({ ...prev, ...updatedData }));
                }
            } else {
                console.error('Upload failed - API response:', response.data);
                message.error(response.data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error config:', error.config);
            
            // Handle different error types
            if (error.response?.status === 500) {
                message.error('Server error: Please check backend logs or try again later');
            } else if (error.response?.status === 413) {
                message.error('File too large: Please upload a smaller image');
            } else if (error.response?.status === 400) {
                message.error(error.response?.data?.message || 'Invalid file format');
            } else {
                message.error('Failed to upload image: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setImageLoading(false);
        }
    };

    const uploadButton = (
        <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageUpload}
            customRequest={({ file, onSuccess, onError }) => {
                // Handle the upload through our custom function
                handleImageUpload({ file }).then(onSuccess).catch(onError);
            }}
        >
            <Button 
                icon={<FaCamera />} 
                loading={imageLoading}
                disabled={imageLoading}
            >
                {imageLoading ? 'Uploading...' : 'Change Photo'}
            </Button>
        </Upload>
    );

    return (
        <div className="p-6">
            <Card
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">My Account</span>
                        <div className="space-x-2">
                            {!editMode ? (
                                <Button
                                    type="primary"
                                    icon={<FaEdit />}
                                    onClick={handleEdit}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        icon={<FaSave />}
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        onClick={() => form.submit()}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                }
                className="max-w-4xl mx-auto shadow-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    className="mt-6"
                >
                    <Row gutter={24}>
                        <Col xs={24} md={8}>
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <Avatar
                                        size={120}
                                        src={profileData.avatar ? `${import.meta.env.VITE_BASE_URL}/${profileData.avatar}` : undefined}
                                        icon={<FaUser />}
                                        className="mb-4"
                                        style={{
                                            backgroundColor: '#1890ff',
                                            fontSize: '48px'
                                        }}
                                    />
                                    <div className="absolute bottom-0 right-0">
                                        {uploadButton}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {profileData.name || 'Admin User'}
                                </h3>
                                <p className="text-gray-500">
                                    {profileData.role || 'Administrator'}
                                </p>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <div className="space-y-4">
                                <Form.Item
                                    label="Full Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                >
                                    <Input
                                        prefix={<FaUser />}
                                        size="large"
                                        disabled={!editMode}
                                        placeholder="Enter your full name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        prefix={<FaEnvelope />}
                                        size="large"
                                        disabled={!editMode}
                                        placeholder="Enter your email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Phone Number"
                                    name="phone"
                                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                                >
                                    <Input
                                        prefix={<FaPhone />}
                                        size="large"
                                        disabled={!editMode}
                                        placeholder="Enter your phone number"
                                    />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <TextArea
                            rows={3}
                            disabled={!editMode}
                            placeholder="Enter your address"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Bio / About"
                        name="bio"
                    >
                        <TextArea
                            rows={4}
                            disabled={!editMode}
                            placeholder="Tell us about yourself"
                        />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default MyAccount;
