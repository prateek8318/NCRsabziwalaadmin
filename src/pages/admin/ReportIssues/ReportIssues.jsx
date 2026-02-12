import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message, Row, Col, Statistic, Spin, Badge } from 'antd';
import { FaExclamationTriangle, FaEye, FaEdit, FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaPhone, FaMapMarkerAlt, FaCarCrash, FaBoxOpen, FaUserInjured, FaEllipsisH } from 'react-icons/fa';
import { getAllReportIssues, getReportIssueDetails, updateReportIssue } from '../../../services/admin/apiReportIssues';
import { convertDate } from '../../../utils/formatDate';

const { TextArea } = Input;
const { Option } = Select;

function ReportIssues() {
    const [reportIssues, setReportIssues] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [updateForm] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        status: '',
        incidentType: '',
        priority: '',
        isEmergency: ''
    });

    useEffect(() => {
        fetchReportIssues();
    }, [pagination.current, pagination.pageSize, filters]);

    const fetchReportIssues = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                ...filters
            };
            
            const response = await getAllReportIssues(params);
            setReportIssues(response.data.reportIssues);
            setStatistics(response.data.statistics);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.totalIssues
            }));
        } catch (error) {
            console.error('Error fetching report issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (record) => {
        try {
            const response = await getReportIssueDetails(record._id);
            setSelectedIssue(response.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error('Error fetching issue details:', error);
        }
    };

    const handleUpdate = (record) => {
        setSelectedIssue(record);
        updateForm.setFieldsValue({
            status: record.status,
            adminNotes: record.adminNotes || '',
            priority: record.priority,
            resolution: record.resolution || ''
        });
        setUpdateModalVisible(true);
    };

    const handleUpdateSubmit = async (values) => {
        try {
            await updateReportIssue(selectedIssue._id, values);
            setUpdateModalVisible(false);
            fetchReportIssues();
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            in_progress: 'blue',
            resolved: 'green',
            rejected: 'red'
        };
        return colors[status] || 'default';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <FaClock />,
            in_progress: <FaEdit />,
            resolved: <FaCheckCircle />,
            rejected: <FaTimesCircle />
        };
        return icons[status] || <FaExclamationTriangle />;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'green',
            medium: 'orange',
            high: 'red',
            critical: 'purple'
        };
        return colors[priority] || 'default';
    };

    const getIncidentTypeIcon = (type) => {
        const icons = {
            road_accident: <FaCarCrash />,
            customer_unresponsive: <FaUser />,
            package_damaged: <FaBoxOpen />,
            personal_injury: <FaUserInjured />,
            others: <FaEllipsisH />
        };
        return icons[type] || <FaEllipsisH />;
    };

    const getIncidentTypeLabel = (type) => {
        const labels = {
            road_accident: 'Road Accident',
            customer_unresponsive: 'Customer Unresponsive',
            package_damaged: 'Package Damaged',
            personal_injury: 'Personal Injury',
            others: 'Others'
        };
        return labels[type] || type;
    };

    const columns = [
        {
            title: 'Reporter',
            key: 'reporter',
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.reporter?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{record.reporter?.mobile || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Incident Type',
            dataIndex: 'incidentType',
            key: 'incidentType',
            render: (type) => (
                <Tag color="purple" icon={getIncidentTypeIcon(type)}>
                    {getIncidentTypeLabel(type)}
                </Tag>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag color={getPriorityColor(priority)}>
                    {priority?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Emergency',
            dataIndex: 'isEmergency',
            key: 'isEmergency',
            render: (isEmergency) => (
                <Badge 
                    status={isEmergency ? 'error' : 'default'} 
                    text={isEmergency ? 'Emergency' : 'Normal'} 
                />
            ),
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
            title: 'Location',
            key: 'location',
            render: (_, record) => (
                record.location ? (
                    <div className="text-sm">
                        <div>{record.location.address || 'No address'}</div>
                        {record.location.coordinates && (
                            <div className="text-xs text-gray-500">
                                {record.location.coordinates.join(', ')}
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400">No location</span>
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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Report Issues Management</h2>
            
            {/* Statistics Cards */}
            {statistics && (
                <Row gutter={16} className="mb-6">
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Issues"
                                value={statistics.total}
                                prefix={<FaExclamationTriangle />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Pending"
                                value={statistics.pending}
                                prefix={<FaClock />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="In Progress"
                                value={statistics.inProgress}
                                prefix={<FaEdit />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Resolved"
                                value={statistics.resolved}
                                prefix={<FaCheckCircle />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Filters */}
            <Card className="mb-4">
                <Row gutter={16} align="middle">
                    <Col>
                        <label className="mr-2">Status:</label>
                        <Select
                            style={{ width: 120 }}
                            placeholder="Filter by status"
                            allowClear
                            value={filters.status || undefined}
                            onChange={(value) => {
                                setFilters(prev => ({ ...prev, status: value }));
                                setPagination(prev => ({ ...prev, current: 1 }));
                            }}
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="resolved">Resolved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </Col>
                    <Col>
                        <label className="mr-2">Incident:</label>
                        <Select
                            style={{ width: 150 }}
                            placeholder="Filter by incident"
                            allowClear
                            value={filters.incidentType || undefined}
                            onChange={(value) => {
                                setFilters(prev => ({ ...prev, incidentType: value }));
                                setPagination(prev => ({ ...prev, current: 1 }));
                            }}
                        >
                            <Option value="road_accident">Road Accident</Option>
                            <Option value="customer_unresponsive">Customer Unresponsive</Option>
                            <Option value="package_damaged">Package Damaged</Option>
                            <Option value="personal_injury">Personal Injury</Option>
                            <Option value="others">Others</Option>
                        </Select>
                    </Col>
                    <Col>
                        <label className="mr-2">Priority:</label>
                        <Select
                            style={{ width: 100 }}
                            placeholder="Priority"
                            allowClear
                            value={filters.priority || undefined}
                            onChange={(value) => {
                                setFilters(prev => ({ ...prev, priority: value }));
                                setPagination(prev => ({ ...prev, current: 1 }));
                            }}
                        >
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                            <Option value="critical">Critical</Option>
                        </Select>
                    </Col>
                    <Col>
                        <label className="mr-2">Emergency:</label>
                        <Select
                            style={{ width: 100 }}
                            placeholder="Emergency"
                            allowClear
                            value={filters.isEmergency !== '' ? filters.isEmergency : undefined}
                            onChange={(value) => {
                                setFilters(prev => ({ ...prev, isEmergency: value }));
                                setPagination(prev => ({ ...prev, current: 1 }));
                            }}
                        >
                            <Option value={true}>Emergency</Option>
                            <Option value={false}>Normal</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Report Issues Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={reportIssues}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} issues`,
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
                title="Report Issue Details"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedIssue && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Reporter Information">
                                    <p><strong>Name:</strong> {selectedIssue.reporter?.name || 'Unknown'}</p>
                                    <p><strong>Mobile:</strong> {selectedIssue.reporter?.mobile || 'N/A'}</p>
                                    <p><strong>Email:</strong> {selectedIssue.reporter?.email || 'N/A'}</p>
                                    <p><strong>Role:</strong> {selectedIssue.reporter?.role || 'N/A'}</p>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Issue Information">
                                    <p><strong>Incident Type:</strong> <Tag color="purple">{getIncidentTypeLabel(selectedIssue.incidentType)}</Tag></p>
                                    <p><strong>Priority:</strong> <Tag color={getPriorityColor(selectedIssue.priority)}>{selectedIssue.priority?.toUpperCase()}</Tag></p>
                                    <p><strong>Status:</strong> <Tag color={getStatusColor(selectedIssue.status)}>{selectedIssue.status?.toUpperCase().replace('_', ' ')}</Tag></p>
                                    <p><strong>Emergency:</strong> <Badge status={selectedIssue.isEmergency ? 'error' : 'default'} text={selectedIssue.isEmergency ? 'Emergency' : 'Normal'} /></p>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16} className="mt-4">
                            <Col span={24}>
                                <Card size="small" title="Description">
                                    <p>{selectedIssue.description || 'No description provided'}</p>
                                </Card>
                            </Col>
                        </Row>
                        {selectedIssue.location && (
                            <Row gutter={16} className="mt-4">
                                <Col span={24}>
                                    <Card size="small" title="Location">
                                        <p><strong>Address:</strong> {selectedIssue.location.address || 'No address'}</p>
                                        {selectedIssue.location.coordinates && (
                                            <p><strong>Coordinates:</strong> {selectedIssue.location.coordinates.join(', ')}</p>
                                        )}
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {selectedIssue.adminNotes && (
                            <Row gutter={16} className="mt-4">
                                <Col span={24}>
                                    <Card size="small" title="Admin Notes">
                                        <p>{selectedIssue.adminNotes}</p>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {selectedIssue.resolution && (
                            <Row gutter={16} className="mt-4">
                                <Col span={24}>
                                    <Card size="small" title="Resolution">
                                        <p>{selectedIssue.resolution}</p>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        <Row gutter={16} className="mt-4">
                            <Col span={12}>
                                <p><strong>Created At:</strong> {convertDate(selectedIssue.createdAt)}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Updated At:</strong> {convertDate(selectedIssue.updatedAt)}</p>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>

            {/* Update Modal */}
            <Modal
                title="Update Report Issue"
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
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Priority"
                        name="priority"
                        rules={[{ required: true, message: 'Please select priority' }]}
                    >
                        <Select placeholder="Select priority">
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                            <Option value="critical">Critical</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Admin Notes"
                        name="adminNotes"
                        rules={[{ required: true, message: 'Please enter admin notes' }]}
                    >
                        <TextArea rows={4} placeholder="Enter admin notes..." />
                    </Form.Item>

                    <Form.Item
                        label="Resolution"
                        name="resolution"
                    >
                        <TextArea rows={4} placeholder="Enter resolution details (if resolved)..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ReportIssues;
