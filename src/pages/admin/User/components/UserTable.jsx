import { Avatar, Button, Space, Switch, Table, Tag } from 'antd'
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserTable = ({ searchText, onDelete, data, loading }) => {
    const navigate = useNavigate();

    console.log('UserTable data:', data);
    console.log('UserTable loading:', loading);
    console.log('UserTable data length:', data?.length);
    
    // Check if data has unique IDs
    if (data && data.length > 0) {
        console.log('First user record:', data[0]);
        console.log('Available ID fields:', {
            id: data[0].id,
            _id: data[0]._id,
            userId: data[0].userId,
            userId: data[0].userId
        });
        
        // Check for duplicate IDs
        const ids = data.map(item => item.id || item._id || item.userId);
        const uniqueIds = [...new Set(ids)];
        console.log('Total IDs:', ids.length, 'Unique IDs:', uniqueIds.length);
        console.log('Duplicate IDs:', ids.length !== uniqueIds.length);
    }


    const handleViewDetails = (record) => {
        navigate(`/vendor/${record.id}`);
    };

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            align: "center",
            render: (_, { profileImage }) => {
                const src = profileImage ? `${BASE_URL}/${profileImage}` : undefined;
                return (<Avatar
                    size={40}
                    src={src}
                    icon={!src && <FaUser />}
                    style={{ backgroundColor: '#f56a00' }}
                />)
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: "center"
        },
        {
            title: 'Mobile no',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            align: "center"
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, { status }) => (
                // <Switch defaultChecked={status} onChange={onChange} />
                <Tag color={status ? "green" : "red"}>{status ? "Verified" : "Not verified"}</Tag>
            )
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     align: "right",
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button type="primary" icon={<IoMdEye />} onClick={() => handleViewDetails(record)}></Button>
        //             <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}>Edit</Button>
        //             <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}></Button>
        //         </Space>
        //     )
        // }
    ];

    const onChange = checked => {
        // console.log(`switch to ${checked}`);
    };

    return <Table
        loading={loading}
        dataSource={data.filter(item => item?.mobileNo?.toLowerCase().includes(searchText.toLowerCase()))}
        // dataSource={transformedData}
        columns={columns}
        rowKey={(record, index) => {
            // Use multiple fallbacks for unique key
            return record.id || record._id || record.userId || `user-${index}`;
        }}
        scroll={{ x: true }}
        bordered={false}
        size='small'
    />;
}

export default UserTable
