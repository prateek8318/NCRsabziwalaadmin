import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { FaEdit, FaStore, FaTrash } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ShopTable = ({ data, searchText, onDelete, loading, }) => {
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Image',
            key: 'image',
            align: 'center',
            render: (_, record) => (
                <Avatar
                    shape="square"
                    size={50}
                    src={`${BASE_URL}/${record.shopImage.replace(/\\/g, '/')}`}
                    alt={record.name}
                />
            )
        },
        {
            title: 'Shop Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Type',
            dataIndex: 'shopType',
            key: 'shopType',
            align: 'center',
            filters: [
                { text: 'Veg', value: 'veg' },
                { text: 'Non-Veg', value: 'non-veg' }
            ],
            onFilter: (value, record) => record.shopType === value,
            render: type => (
                <Tag color={type === 'veg' ? 'green' : 'red'}>{type?.toUpperCase()}</Tag>
            )
        },
        {
            title: 'Service',
            key: 'service',
            align: 'center',
            filters: [...new Set(data.map(d => d.serviceId?.name))]
                .filter(Boolean)
                .map(service => ({ text: service, value: service })),
            onFilter: (value, record) => record.serviceId?.name === value,
            render: (_, record) => record.serviceId?.name || 'N/A'
        },
        {
            title: 'Vendor',
            dataIndex: 'vendorId',
            key: 'vendorId',
            align: 'center',
            render: (_, record) => record.vendorId?.name || 'N/A'
        },
        // {
        //     title: 'Rating',
        //     dataIndex: 'rating',
        //     key: 'rating',
        //     align: 'center'
        // },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center'
        },
        {
            title: 'Product Count',
            dataIndex: 'productCount',
            key: 'productCount',
            align: 'center'
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.wallet_balance || 0}</Tag>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: status => (
                <Tag color={status === 'active' ? 'blue' : 'gray'}>{status}</Tag>
            )
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     align: 'right',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Tooltip title="Details"> <Button type="primary" icon={<IoMdEye />} onClick={() => navigate(`/admin/vendor/shops/${record._id}`)} /></Tooltip>
        //             <Tooltip title="Delete"> <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)} /></Tooltip> 
        //         </Space>
        //     )
        // }
    ];

    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) || item.vendorId.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />
        </>
    );
};

export default ShopTable;
