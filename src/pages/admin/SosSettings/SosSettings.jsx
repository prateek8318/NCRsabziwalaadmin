import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Switch, Button, message, Row, Col, Space, Modal, InputNumber, ColorPicker, Select, Popconfirm } from 'antd';
import { FaPhone, FaWhatsapp, FaShieldAlt, FaFire, FaAmbulance, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { getSosSettings, updateSosSettings } from '../../../services/admin/apiSosSettings';

const { TextArea } = Input;

function SosSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [form] = Form.useForm();
    const [quickDialForm] = Form.useForm();           // ✅ Alag form for Quick Dial Modal
    const [emergencyContactForm] = Form.useForm();    // ✅ Alag form for Emergency Contact Modal

    const [quickDialModalVisible, setQuickDialModalVisible] = useState(false);
    const [editingQuickDial, setEditingQuickDial] = useState(null);
    const [emergencyContactModalVisible, setEmergencyContactModalVisible] = useState(false);
    const [editingEmergencyContact, setEditingEmergencyContact] = useState(null);

    useEffect(() => {
        fetchSosSettings();
    }, []);

    const fetchSosSettings = async () => {
        setLoading(true);
        try {
            const response = await getSosSettings();
            setSettings(response.data);
            form.setFieldsValue(response.data);
        } catch (error) {
            console.error('Error fetching SOS settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        setUpdateLoading(true);
        try {
            await updateSosSettings(values);
            setSettings(values);
            message.success('SOS settings updated successfully');
        } catch (error) {
            console.error('Error updating SOS settings:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────
    // QUICK DIAL — commented out as requested
    // ─────────────────────────────────────────────────────────────
    /*
    const addQuickDialButton = () => {
        const newButton = {
            name: '',
            mobile: '',
            icon: 'shield',
            color: '#0066cc',
            isActive: true,
            order: (settings?.quickDialButtons?.length || 0) + 1
        };
        setEditingQuickDial(newButton);
        quickDialForm.resetFields();
        setQuickDialModalVisible(true);
    };

    const editQuickDialButton = (button) => {
        setEditingQuickDial({ ...button });
        quickDialForm.setFieldsValue({
            name: button.name || '',
            mobile: button.mobile || '',
            icon: button.icon || 'shield',
            color: button.color || '#0066cc',
            isActive: button.isActive !== undefined ? button.isActive : true,
            order: button.order || 1
        });
        setQuickDialModalVisible(true);
    };

    const saveQuickDialButton = async () => {
        try {
            const values = await quickDialForm.validateFields();
            const updatedQuickDial = [...(settings?.quickDialButtons || [])];
            const existingIndex = updatedQuickDial.findIndex(btn => btn.order === editingQuickDial?.order);

            if (existingIndex >= 0) {
                updatedQuickDial[existingIndex] = values;
            } else {
                updatedQuickDial.push(values);
            }

            const updatedSettings = {
                ...settings,
                quickDialButtons: updatedQuickDial.sort((a, b) => a.order - b.order)
            };

            await updateSosSettings(updatedSettings);
            setSettings(updatedSettings);
            form.setFieldsValue(updatedSettings);
            setQuickDialModalVisible(false);
            setEditingQuickDial(null);
            message.success('Quick dial button saved successfully');
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const deleteQuickDialButton = (order) => {
        const updatedQuickDial = settings?.quickDialButtons?.filter(btn => btn.order !== order) || [];
        const updatedSettings = { ...settings, quickDialButtons: updatedQuickDial };
        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
    };
    */

    // ─────────────────────────────────────────────────────────────
    // EMERGENCY CONTACTS
    // ─────────────────────────────────────────────────────────────
    const addEmergencyContact = () => {
        const newContact = {
            name: '',
            mobile: '',
            type: 'police',
            isActive: true
        };
        setEditingEmergencyContact(null); // null = add mode
        emergencyContactForm.resetFields();
        emergencyContactForm.setFieldsValue(newContact);
        setEmergencyContactModalVisible(true);
    };

    const editEmergencyContact = (contact) => {
        setEditingEmergencyContact({ ...contact });
        // ✅ Existing data seedha form mein set ho jaayega
        emergencyContactForm.setFieldsValue({
            name: contact.name || '',
            mobile: contact.mobile || '',
            type: contact.type || 'police',
            isActive: contact.isActive !== undefined ? contact.isActive : true
        });
        setEmergencyContactModalVisible(true);
    };

    const saveEmergencyContact = async () => {
        try {
            const values = await emergencyContactForm.validateFields();
            const updatedContacts = [...(settings?.emergencyContacts || [])];

            if (editingEmergencyContact) {
                // Edit mode — original mobile se dhundho
                const existingIndex = updatedContacts.findIndex(
                    contact => contact.mobile === editingEmergencyContact.mobile
                );
                if (existingIndex >= 0) {
                    updatedContacts[existingIndex] = values;
                } else {
                    updatedContacts.push(values);
                }
            } else {
                // Add mode
                updatedContacts.push(values);
            }

            const updatedSettings = { ...settings, emergencyContacts: updatedContacts };
            await updateSosSettings(updatedSettings);
            setSettings(updatedSettings);
            form.setFieldsValue(updatedSettings);
            setEmergencyContactModalVisible(false);
            setEditingEmergencyContact(null);
            message.success(
                editingEmergencyContact
                    ? 'Emergency contact updated successfully'
                    : 'Emergency contact added successfully'
            );
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const deleteEmergencyContact = (mobile) => {
        const updatedContacts = settings?.emergencyContacts?.filter(contact => contact.mobile !== mobile) || [];
        const updatedSettings = { ...settings, emergencyContacts: updatedContacts };
        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div>Loading SOS settings...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">SOS Settings</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={settings}
            >
                {/* Emergency Call Settings */}
                <Card title="Emergency Call Settings" className="mb-6">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Emergency Helpline Name"
                                name={['emergencyCall', 'name']}
                                rules={[{ required: true, message: 'Please enter emergency helpline name' }]}
                            >
                                <Input placeholder="Enter emergency helpline name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Emergency Helpline Mobile"
                                name={['emergencyCall', 'mobile']}
                                rules={[
                                    { required: true, message: 'Please enter emergency helpline mobile' },
                                    { pattern: /^[0-9+\s\-()]+$/, message: 'Only numbers, spaces, and + - () characters are allowed' },
                                    { min: 10, message: 'Mobile number must be at least 10 digits' },
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();
                                            const digitsOnly = value.replace(/\D/g, '');
                                            if (digitsOnly.length > 10) {
                                                return Promise.reject('Mobile number cannot exceed 10 digits');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="Enter emergency helpline mobile"
                                    maxLength={10}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                            'Tab', 'Home', 'End', '+', '-', ' ', '(', ')'
                                        ];
                                        const isDigit = /^[0-9]$/.test(e.key);
                                        if (!isDigit && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Active"
                                name={['emergencyCall', 'isActive']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* WhatsApp Support Settings */}
                <Card title="WhatsApp Support Settings" className="mb-6">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="WhatsApp Support Name"
                                name={['whatsappSupport', 'name']}
                                rules={[{ required: true, message: 'Please enter WhatsApp support name' }]}
                            >
                                <Input placeholder="Enter WhatsApp support name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="WhatsApp Support Mobile"
                                name={['whatsappSupport', 'mobile']}
                                rules={[
                                    { required: true, message: 'Please enter WhatsApp support mobile' },
                                    { pattern: /^[0-9+\s\-()]+$/, message: 'Only numbers, spaces, and + - () characters are allowed' },
                                    { min: 10, message: 'Mobile number must be at least 10 digits' },
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();
                                            const digitsOnly = value.replace(/\D/g, '');
                                            if (digitsOnly.length > 10) {
                                                return Promise.reject('Mobile number cannot exceed 10 digits');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="Enter WhatsApp support mobile"
                                    maxLength={10}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                            'Tab', 'Home', 'End', '+', '-', ' ', '(', ')'
                                        ];
                                        const isDigit = /^[0-9]$/.test(e.key);
                                        if (!isDigit && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Active"
                                name={['whatsappSupport', 'isActive']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="WhatsApp Message Template"
                                name={['whatsappSupport', 'message']}
                                rules={[{ required: true, message: 'Please enter WhatsApp message template' }]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter WhatsApp message template (use [location] for location placeholder)"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* ── Quick Dial Buttons section — commented out ── */}
                {/*
                <Card
                    title="Quick Dial Buttons"
                    className="mb-6"
                    extra={
                        <Button type="primary" icon={<FaPlus />} onClick={addQuickDialButton}>
                            Add Button
                        </Button>
                    }
                >
                    <Row gutter={16}>
                        {settings?.quickDialButtons?.map((button, index) => (
                            <Col span={8} key={index} className="mb-4">
                                <Card size="small" className="text-center">
                                    <div
                                        className="mb-2 p-3 rounded"
                                        style={{ backgroundColor: button.color + '20', color: button.color }}
                                    >
                                        <FaShieldAlt size={24} />
                                    </div>
                                    <h4 className="font-medium">{button.name}</h4>
                                    <p className="text-sm text-gray-600">{button.mobile}</p>
                                    <Space className="mt-2">
                                        <Button size="small" icon={<FaEdit />} onClick={() => editQuickDialButton(button)}>Edit</Button>
                                        <Button size="small" danger icon={<FaTrash />} onClick={() => deleteQuickDialButton(button.order)}>Delete</Button>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
                */}

                {/* Emergency Contacts */}
                <Card
                    title="Emergency Contacts"
                    className="mb-6"
                    extra={
                        <Button type="primary" icon={<FaPlus />} onClick={addEmergencyContact}>
                            Add Contact
                        </Button>
                    }
                >
                    <Row gutter={16}>
                        {settings?.emergencyContacts?.map((contact, index) => (
                            <Col span={12} key={index} className="mb-4">
                                <Card size="small">
                                    <h4 className="font-medium">{contact.name}</h4>
                                    <p className="text-sm text-gray-600">{contact.mobile}</p>
                                    <p className="text-xs text-gray-500">Type: {contact.type}</p>
                                    <Space className="mt-2">
                                        <Button size="small" icon={<FaEdit />} onClick={() => editEmergencyContact(contact)}>
                                            Edit
                                        </Button>
                                        <Popconfirm
                                            title="Delete Contact"
                                            description="Are you sure you want to delete this contact?"
                                            onConfirm={() => deleteEmergencyContact(contact.mobile)}
                                            okText="Yes, Delete"
                                            cancelText="Cancel"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button size="small" danger icon={<FaTrash />}>
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>

                {/* Form Settings */}
                <Card title="Form Settings" className="mb-6">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label="Show Emergency Contact"
                                name={['formSettings', 'showEmergencyContact']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Show Location"
                                name={['formSettings', 'showLocation']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Require Remarks"
                                name={['formSettings', 'requireRemarks']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Auto-fill Driver Details"
                                name={['formSettings', 'autoFillDriverDetails']}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updateLoading} size="large">
                        Save All Settings
                    </Button>
                </Form.Item>
            </Form>

            {/* ── Quick Dial Button Modal — commented out ── */}
            {/*
            <Modal
                title={editingQuickDial?.name ? "Edit Quick Dial Button" : "Add Quick Dial Button"}
                open={quickDialModalVisible}
                onCancel={() => { setQuickDialModalVisible(false); setEditingQuickDial(null); }}
                onOk={saveQuickDialButton}
                width={600}
            >
                <Form form={quickDialForm} layout="vertical">
                    ...
                </Form>
            </Modal>
            */}

            {/* Emergency Contact Modal */}
            <Modal
                title={editingEmergencyContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
                open={emergencyContactModalVisible}
                onCancel={() => {
                    setEmergencyContactModalVisible(false);
                    setEditingEmergencyContact(null);
                    emergencyContactForm.resetFields();
                }}
                width={600}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setEmergencyContactModalVisible(false);
                            setEditingEmergencyContact(null);
                            emergencyContactForm.resetFields();
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={saveEmergencyContact}
                    >
                        {editingEmergencyContact ? 'Update' : 'Add'}
                    </Button>
                ]}
            >
                {/* ✅ Dedicated form instance — main form se alag */}
                <Form form={emergencyContactForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Contact Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter contact name' }]}
                            >
                                <Input placeholder="Enter contact name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mobile Number"
                                name="mobile"
                                rules={[
                                    { required: true, message: 'Please enter mobile number' },
                                    {
                                        pattern: /^[0-9+\s\-()]+$/,
                                        message: 'Only numbers, spaces, and + - () characters are allowed'
                                    },
                                    { min: 10, message: 'Mobile number must be at least 10 digits' },
                                    // ✅ Max 10 digits validation
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();
                                            const digitsOnly = value.replace(/\D/g, '');
                                            if (digitsOnly.length > 10) {
                                                return Promise.reject('Mobile number cannot exceed 10 digits');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                {/* ✅ maxLength se 10+ characters type hi nahi ho paayenge */}
                                <Input
                                    placeholder="Enter mobile number"
                                    maxLength={10}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                                            'Tab', 'Home', 'End', '+', '-', ' ', '(', ')'
                                        ];
                                        const isDigit = /^[0-9]$/.test(e.key);
                                        if (!isDigit && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Contact Type"
                                name="type"
                                rules={[{ required: true, message: 'Please select contact type' }]}
                            >
                                <Select placeholder="Select contact type">
                                    <Select.Option value="police">Police</Select.Option>
                                    <Select.Option value="fire">Fire Brigade</Select.Option>
                                    <Select.Option value="ambulance">Ambulance</Select.Option>
                                    <Select.Option value="hospital">Hospital</Select.Option>
                                    <Select.Option value="control">Control Room</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Active"
                                name="isActive"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default SosSettings;