import React, { useState } from 'react';
import { Avatar, Card, Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    // Mock data - replace with actual data from your backend
    const [profileData, setProfileData] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1 234 567 890',
        address: '123 Admin Street, Admin City',
        bio: 'Administrator of the system',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    });

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue(profileData);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setProfileData(values);
            setIsEditing(false);
            message.success('Profile updated successfully!');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <>
            <div className="p-6">
                <Card className="max-w-3xl mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <Avatar
                            size={120}
                            src={profileData.avatar}
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
