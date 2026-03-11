import React, { useState, useEffect } from 'react';
import { Avatar, Card, Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import axiosInstance from '@utils/axiosInstance';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/admin/profile');
            console.log('Profile API response:', response.data);
            if (response.data.success) {
                setProfileData(response.data.data);
                form.setFieldsValue(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            message.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue(profileData);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Saving profile data:', values);
            
            const response = await axiosInstance.patch('/api/admin/profile', values);
            console.log('Profile update response:', response.data);
            
            if (response.data.success) {
                setProfileData(values);
                setIsEditing(false);
                message.success('Profile updated successfully!');
            } else {
                message.error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            message.error('Failed to update profile');
        }
    };

    return (
        <>
            <div className="p-6">
                <Card className="max-w-3xl mx-auto" loading={loading}>
                    <div className="flex flex-col items-center mb-8">
                        <Avatar
                            size={120}
                            src={profileData.avatar ? `${import.meta.env.VITE_BASE_URL}/${profileData.avatar}` : undefined}
                            icon={<UserOutlined />}
                            className="mb-4"
                        />
                        {!isEditing && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                className="mt-4"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        disabled={!isEditing}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label="Full Name"
                                name="name"
                                normalize={(value) => value?.trim()}
                                rules={[
                                    { required: true, message: 'Please input your name!' },
                                    { min: 3, message: 'Name must be at least 3 characters' },
                                    { max: 50, message: 'Name cannot exceed 50 characters' }
                                ]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                normalize={(value) => value?.trim()}
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' },
                                    { max: 50, message: 'Email cannot exceed 50 characters' }
                                ]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>

                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                normalize={(value) => value?.trim()}
                                rules={[
                                    { required: true, message: 'Please input your phone number!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit phone number' }
                                ]}
                            >
                                <Input maxLength={10} />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                normalize={(value) => value?.trim()}
                                rules={[
                                    { required: true, message: 'Please input your address!' },
                                    { max: 200, message: 'Address cannot exceed 200 characters' }
                                ]}
                            >
                                <Input maxLength={200} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Bio"
                            name="bio"
                            normalize={(value) => value?.trim()}
                            rules={[
                                { required: true, message: 'Please input your bio!' },
                                { max: 500, message: 'Bio cannot exceed 500 characters' }
                            ]}
                        >
                            <Input.TextArea rows={4} maxLength={500} />
                        </Form.Item>

                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-6">
                                <Button onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </>
    );
}

export default Profile;
