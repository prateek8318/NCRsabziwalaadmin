import { Avatar, Button, Space, Switch, Table, Tag } from 'antd'
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import dataSource from '../data.json'
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserTable = ({ searchText, onDelete, data }) => {
    const navigate = useNavigate();

    // console.log(data)


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
        dataSource={data.filter(item => item.mobileNo.toLowerCase().includes(searchText.toLowerCase()))}
        // dataSource={transformedData}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered={false}
        size='small'
    />;
}

export default UserTable
