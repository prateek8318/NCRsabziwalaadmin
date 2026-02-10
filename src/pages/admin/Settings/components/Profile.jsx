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
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please input your address!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Bio"
                            name="bio"
                            rules={[{ required: true, message: 'Please input your bio!' }]}
                        >
                            <Input.TextArea rows={4} />
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
