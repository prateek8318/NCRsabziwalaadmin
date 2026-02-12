import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message, Row, Col, Statistic, Spin } from 'antd';
import { FaExclamationTriangle, FaEye, FaEdit, FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getAllSosRequests, getSosRequestDetails, updateSosRequest } from '../../../services/admin/apiSos';
import { convertDate } from '../../../utils/formatDate';

const { TextArea } = Input;
const { Option } = Select;

function Sos() {
    const [sosRequests, setSosRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedSos, setSelectedSos] = useState(null);
    const [updateForm] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchSosRequests();
    }, [pagination.current, pagination.pageSize, statusFilter]);

    const fetchSosRequests = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize
            };
            if (statusFilter) {
                params.status = statusFilter;
            }
            
            const response = await getAllSosRequests(params);
            setSosRequests(response.data.sosRequests);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.totalRequests
            }));
        } catch (error) {
            console.error('Error fetching SOS requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (record) => {
        try {
            const response = await getSosRequestDetails(record._id);
            setSelectedSos(response.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error('Error fetching SOS details:', error);
        }
    };

    const handleUpdate = (record) => {
        setSelectedSos(record);
        updateForm.setFieldsValue({
            status: record.status,
            adminNotes: record.adminNotes || '',
            sosType: record.sosType,
            emergencyContact: record.emergencyContact || {}
        });
        setUpdateModalVisible(true);
    };

    const handleUpdateSubmit = async (values) => {
        try {
            await updateSosRequest(selectedSos._id, values);
            setUpdateModalVisible(false);
            fetchSosRequests();
        } catch (error) {
            console.error('Error updating SOS:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            in_progress: 'blue',
            resolved: 'green',
            cancelled: 'red'
        };
        return colors[status] || 'default';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <FaClock />,
            in_progress: <FaEdit />,
            resolved: <FaCheckCircle />,
            cancelled: <FaTimesCircle />
        };
        return icons[status] || <FaExclamationTriangle />;
    };

    const columns = [
        {
            title: 'Driver',
            key: 'driver',
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.driverName}</div>
                    <div className="text-xs text-gray-500">{record.driverMobile}</div>
                </div>
            ),
        },
        {
            title: 'SOS Type',
            dataIndex: 'sosType',
            key: 'sosType',
            render: (type) => (
                <Tag color="purple">
                    {type?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            ellipsis: true,
            width: 200,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                    {status?.toUpperCase().replace('_', ' ')}
                </Tag>
            ),
        },
        {
            title: 'Emergency Contact',
            key: 'emergencyContact',
            render: (_, record) => (
                record.emergencyContact ? (
                    <div>
                        <div className="font-medium">{record.emergencyContact.name}</div>
                        <div className="text-xs text-gray-500">{record.emergencyContact.mobile}</div>
                    </div>
                ) : (
                    <span className="text-gray-400">No contact</span>
                )
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => convertDate(date),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<FaEye />}
                        onClick={() => handleViewDetails(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<FaEdit />}
                        onClick={() => handleUpdate(record)}
                    >
                        Update
                    </Button>
                </Space>
            ),
        },
    ];

    // Calculate statistics
    const stats = {
        total: sosRequests.length,
        pending: sosRequests.filter(req => req.status === 'pending').length,
        inProgress: sosRequests.filter(req => req.status === 'in_progress').length,
        resolved: sosRequests.filter(req => req.status === 'resolved').length,
        cancelled: sosRequests.filter(req => req.status === 'cancelled').length,
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">SOS Management</h2>
            
            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Requests"
                            value={stats.total}
                            prefix={<FaExclamationTriangle />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pending}
                            prefix={<FaClock />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="In Progress"
                            value={stats.inProgress}
                            prefix={<FaEdit />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Resolved"
                            value={stats.resolved}
                            prefix={<FaCheckCircle />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4">
                <Row gutter={16} align="middle">
                    <Col>
                        <label className="mr-2">Status Filter:</label>
                        <Select
                            style={{ width: 150 }}
                            placeholder="Filter by status"
                            allowClear
                            value={statusFilter || undefined}
                            onChange={(value) => {
                                setStatusFilter(value);
                                setPagination(prev => ({ ...prev, current: 1 }));
                            }}
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="resolved">Resolved</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* SOS Requests Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={sosRequests}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({
                                ...prev,
                                current: page,
                                pageSize: pageSize
                            }));
                        }
                    }}
                    scroll={{ x: true }}
                />
            </Card>

            {/* Details Modal */}
            <Modal
                title="SOS Request Details"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedSos && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Driver Information">
                                    <p><strong>Name:</strong> {selectedSos.driverName}</p>
                                    <p><strong>Mobile:</strong> {selectedSos.driverMobile}</p>
                                    <p><strong>Email:</strong> {selectedSos.driver?.email}</p>
                                    {selectedSos.driver?.address && (
                                        <p><strong>Address:</strong> {selectedSos.driver.address}</p>
                                    )}
                                    {selectedSos.driver?.vehicle && (
                                        <div>
                                            <p><strong>Vehicle Type:</strong> {selectedSos.driver.vehicle.type}</p>
                                            <p><strong>Vehicle Model:</strong> {selectedSos.driver.vehicle.model}</p>
                                            <p><strong>Registration:</strong> {selectedSos.driver.vehicle.registrationNumber}</p>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="SOS Information">
                                    <p><strong>Type:</strong> <Tag color="purple">{selectedSos.sosType?.toUpperCase()}</Tag></p>
                                    <p><strong>Status:</strong> <Tag color={getStatusColor(selectedSos.status)}>{selectedSos.status?.toUpperCase().replace('_', ' ')}</Tag></p>
                                    <p><strong>Remarks:</strong> {selectedSos.remarks}</p>
                                    {selectedSos.emergencyContact && (
                                        <div>
                                            <p><strong>Emergency Contact:</strong> {selectedSos.emergencyContact.name}</p>
                                            <p><strong>Emergency Mobile:</strong> {selectedSos.emergencyContact.mobile}</p>
                                        </div>
                                    )}
                                    {selectedSos.location && (
                                        <p><strong>Location:</strong> {selectedSos.location.coordinates.join(', ')}</p>
                                    )}
                                    {selectedSos.adminNotes && (
                                        <p><strong>Admin Notes:</strong> {selectedSos.adminNotes}</p>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16} className="mt-4">
                            <Col span={12}>
                                <p><strong>Created At:</strong> {convertDate(selectedSos.createdAt)}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Updated At:</strong> {convertDate(selectedSos.updatedAt)}</p>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>

            {/* Update Modal */}
            <Modal
                title="Update SOS Request"
                open={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                onOk={() => updateForm.submit()}
                width={600}
            >
                <Form
                    form={updateForm}
                    layout="vertical"
                    onFinish={handleUpdateSubmit}
                >
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value="pending">Pending</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="resolved">Resolved</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="SOS Type"
                        name="sosType"
                    >
                        <Select placeholder="Select SOS type">
                            <Option value="breakdown">Breakdown</Option>
                            <Option value="accident">Accident</Option>
                            <Option value="medical">Medical</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Admin Notes"
                        name="adminNotes"
                        rules={[{ required: true, message: 'Please enter admin notes' }]}
                    >
                        <TextArea rows={4} placeholder="Enter admin notes..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Emergency Contact Name"
                                name={['emergencyContact', 'name']}
                            >
                                <Input placeholder="Enter emergency contact name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Emergency Contact Mobile"
                                name={['emergencyContact', 'mobile']}
                            >
                                <Input placeholder="Enter emergency contact mobile" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default Sos;
