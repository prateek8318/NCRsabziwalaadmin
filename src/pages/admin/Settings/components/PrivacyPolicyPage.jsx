import React, { useEffect, useState } from 'react';
import { Button, Form, message, Spin, Input, Select, Space, Card, Table, Modal, Tag } from 'antd';
import { useParams } from 'react-router';
import { getAllPrivacyPolicies, createPrivacyPolicy, updatePrivacyPolicy, deletePrivacyPolicy } from '../../../../services/admin/apiCms';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const { TextArea } = Input;
const { Option } = Select;

// HTML sanitizer function
const sanitizeHTML = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

// Function to convert plain text to basic HTML
const textToHTML = (text) => {
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/gm, text => text.trim() ? `<p>${text}</p>` : '');
};

function PrivacyPolicyPage() {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const { type } = useParams();

    const fetchPrivacyPolicies = async () => {
        try {
            const res = await getAllPrivacyPolicies(type);
            setData(res.data || []);
        } catch (error) {
            message.error('Failed to load Privacy Policies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrivacyPolicies();
    }, [type]);

    const handleCreate = () => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue({
            title: item.title,
            content: sanitizeHTML(item.content), // Convert HTML to plain text
            type: item.type,
            isActive: item.isActive
        });
        setModalVisible(true);
    };

    const handleView = (item) => {
        setViewingItem(item);
        setViewModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deletePrivacyPolicy(id);
            fetchPrivacyPolicies();
        } catch (error) {
            console.error('Error deleting privacy policy:', error);
        }
    };

    const onFinish = async (values) => {
        setUpdateLoading(true);
        try {
            // Convert plain text to HTML before saving
            const formattedValues = {
                ...values,
                content: textToHTML(values.content)
            };
            
            if (editingItem) {
                await updatePrivacyPolicy(editingItem._id, formattedValues);
            } else {
                await createPrivacyPolicy(formattedValues);
            }
            setModalVisible(false);
            fetchPrivacyPolicies();
        } catch (error) {
            console.error('Error saving privacy policy:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title) => <span className="font-medium">{title}</span>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'user' ? 'blue' : 'green'}>
                    {type?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<FaEye />}
                        onClick={() => handleView(record)}
                    >
                        View
                    </Button>
                    <Button
                        size="small"
                        icon={<FaEdit />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<FaTrash />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Privacy Policy {type && `(${type.toUpperCase()})`}</h2>
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={handleCreate}
                >
                    Add Privacy Policy
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingItem ? 'Edit Privacy Policy' : 'Create Privacy Policy'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                width={800}
                confirmLoading={updateLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter title' }]}
                    >
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select type' }]}
                    >
                        <Select placeholder="Select type">
                            <Option value="user">User</Option>
                            <Option value="driver">Driver</Option>
                            <Option value="all">All</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please enter content' }]}
                    >
                        <TextArea 
                            rows={8} 
                            placeholder="Enter privacy policy content..."
                            style={{ fontSize: '14px', lineHeight: '1.6' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Active"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Select defaultValue={true}>
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                title="Privacy Policy Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                {viewingItem && (
                    <div>
                        <Card size="small" className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{viewingItem.title}</h3>
                            <div className="space-y-2">
                                <p><strong>Type:</strong> <Tag color={viewingItem.type === 'user' ? 'blue' : 'green'}>{viewingItem.type?.toUpperCase()}</Tag></p>
                                <p><strong>Status:</strong> <Tag color={viewingItem.isActive ? 'green' : 'red'}>{viewingItem.isActive ? 'Active' : 'Inactive'}</Tag></p>
                                <p><strong>Created:</strong> {new Date(viewingItem.createdAt).toLocaleDateString()}</p>
                                <p><strong>Updated:</strong> {new Date(viewingItem.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </Card>
                        <Card size="small" title="Content">
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
                                {sanitizeHTML(viewingItem.content)}
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default PrivacyPolicyPage;
