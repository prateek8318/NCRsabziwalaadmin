import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Switch, Button, message, Row, Col, Space, Modal, InputNumber, ColorPicker, Select } from 'antd';
import { FaPhone, FaWhatsapp, FaShieldAlt, FaFire, FaAmbulance, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { getSosSettings, updateSosSettings } from '../../../services/admin/apiSosSettings';

const { TextArea } = Input;

function SosSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [form] = Form.useForm();
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
        setQuickDialModalVisible(true);
    };

    const editQuickDialButton = (button) => {
        setEditingQuickDial({ ...button });
        setQuickDialModalVisible(true);
    };

    const saveQuickDialButton = () => {
        if (!editingQuickDial) return;

        const updatedQuickDial = [...(settings?.quickDialButtons || [])];
        const existingIndex = updatedQuickDial.findIndex(btn => btn.order === editingQuickDial.order);
        
        if (existingIndex >= 0) {
            updatedQuickDial[existingIndex] = editingQuickDial;
        } else {
            updatedQuickDial.push(editingQuickDial);
        }

        const updatedSettings = {
            ...settings,
            quickDialButtons: updatedQuickDial.sort((a, b) => a.order - b.order)
        };

        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
        setQuickDialModalVisible(false);
        setEditingQuickDial(null);
    };

    const deleteQuickDialButton = (order) => {
        const updatedQuickDial = settings?.quickDialButtons?.filter(btn => btn.order !== order) || [];
        const updatedSettings = {
            ...settings,
            quickDialButtons: updatedQuickDial
        };
        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
    };

    const addEmergencyContact = () => {
        const newContact = {
            name: '',
            mobile: '',
            type: 'police',
            isActive: true
        };
        setEditingEmergencyContact(newContact);
        setEmergencyContactModalVisible(true);
    };

    const editEmergencyContact = (contact) => {
        setEditingEmergencyContact({ ...contact });
        setEmergencyContactModalVisible(true);
    };

    const saveEmergencyContact = () => {
        if (!editingEmergencyContact) return;

        const updatedContacts = [...(settings?.emergencyContacts || [])];
        const existingIndex = updatedContacts.findIndex(contact => contact.mobile === editingEmergencyContact.mobile);
        
        if (existingIndex >= 0) {
            updatedContacts[existingIndex] = editingEmergencyContact;
        } else {
            updatedContacts.push(editingEmergencyContact);
        }

        const updatedSettings = {
            ...settings,
            emergencyContacts: updatedContacts
        };

        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
        setEmergencyContactModalVisible(false);
        setEditingEmergencyContact(null);
    };

    const deleteEmergencyContact = (mobile) => {
        const updatedContacts = settings?.emergencyContacts?.filter(contact => contact.mobile !== mobile) || [];
        const updatedSettings = {
            ...settings,
            emergencyContacts: updatedContacts
        };
        setSettings(updatedSettings);
        form.setFieldsValue(updatedSettings);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div>Loading SOS settings...</div>
        </div>;
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
                                rules={[{ required: true, message: 'Please enter emergency helpline mobile' }]}
                            >
                                <Input placeholder="Enter emergency helpline mobile" />
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
                                rules={[{ required: true, message: 'Please enter WhatsApp support mobile' }]}
                            >
                                <Input placeholder="Enter WhatsApp support mobile" />
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

                {/* Quick Dial Buttons */}
                <Card 
                    title="Quick Dial Buttons" 
                    className="mb-6"
                    extra={
                        <Button 
                            type="primary" 
                            icon={<FaPlus />} 
                            onClick={addQuickDialButton}
                        >
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
                                        <Button 
                                            size="small" 
                                            icon={<FaEdit />} 
                                            onClick={() => editQuickDialButton(button)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            size="small" 
                                            danger 
                                            icon={<FaTrash />} 
                                            onClick={() => deleteQuickDialButton(button.order)}
                                        >
                                            Delete
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>

                {/* Emergency Contacts */}
                <Card 
                    title="Emergency Contacts" 
                    className="mb-6"
                    extra={
                        <Button 
                            type="primary" 
                            icon={<FaPlus />} 
                            onClick={addEmergencyContact}
                        >
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
                                        <Button 
                                            size="small" 
                                            icon={<FaEdit />} 
                                            onClick={() => editEmergencyContact(contact)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            size="small" 
                                            danger 
                                            icon={<FaTrash />} 
                                            onClick={() => deleteEmergencyContact(contact.mobile)}
                                        >
                                            Delete
                                        </Button>
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

            {/* Quick Dial Button Modal */}
            <Modal
                title={editingQuickDial?.name ? "Edit Quick Dial Button" : "Add Quick Dial Button"}
                open={quickDialModalVisible}
                onCancel={() => {
                    setQuickDialModalVisible(false);
                    setEditingQuickDial(null);
                }}
                onOk={saveQuickDialButton}
                width={600}
            >
                <Form layout="vertical" initialValues={editingQuickDial}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Button Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter button name' }]}
                            >
                                <Input placeholder="Enter button name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mobile Number"
                                name="mobile"
                                rules={[{ required: true, message: 'Please enter mobile number' }]}
                            >
                                <Input placeholder="Enter mobile number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Icon"
                                name="icon"
                                rules={[{ required: true, message: 'Please select icon' }]}
                            >
                                <Select placeholder="Select icon">
                                    <Select.Option value="shield">Shield</Select.Option>
                                    <Select.Option value="fire">Fire</Select.Option>
                                    <Select.Option value="ambulance">Ambulance</Select.Option>
                                    <Select.Option value="police">Police</Select.Option>
                                    <Select.Option value="hospital">Hospital</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[{ required: true, message: 'Please select color' }]}
                            >
                                <Input type="color" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Order"
                                name="order"
                                rules={[{ required: true, message: 'Please enter order' }]}
                            >
                                <InputNumber min={1} placeholder="Display order" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
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

            {/* Emergency Contact Modal */}
            <Modal
                title={editingEmergencyContact?.name ? "Edit Emergency Contact" : "Add Emergency Contact"}
                open={emergencyContactModalVisible}
                onCancel={() => {
                    setEmergencyContactModalVisible(false);
                    setEditingEmergencyContact(null);
                }}
                onOk={saveEmergencyContact}
                width={600}
            >
                <Form layout="vertical" initialValues={editingEmergencyContact}>
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
                                rules={[{ required: true, message: 'Please enter mobile number' }]}
                            >
                                <Input placeholder="Enter mobile number" />
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
