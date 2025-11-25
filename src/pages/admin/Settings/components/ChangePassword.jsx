import React, { useState } from 'react';
import { Form, Input, Button, message, Breadcrumb } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // TODO: Implement password change logic here
            // console.log('Password change values:', values);
            message.success('Password changed successfully!');
            form.resetFields();
        } catch (error) {
            message.error('Failed to change password. Please try again.');
            console.error('Error changing password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-6 lg:w-1/2">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <Form
                    form={form}
                    name="change_password"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[
                            { required: true, message: 'Please enter your current password' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Enter current password"
                            className="h-10"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please enter your new password' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must contain uppercase, lowercase, number, and special character'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Enter new password"
                            className="h-10"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm new password"
                            className="h-10"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default ChangePassword;
