import React from 'react';
import { Avatar, Tooltip, Table } from 'antd';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

const SectionTable = ({ data = [], loading }) => {

    const columns = [
        {
            title: 'Section Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Explore Name',
            dataIndex: ['exploreId', 'name'],
            key: 'exploreName',
            align: 'center',
            render: (_, record) => record.exploreId?.name || '—',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            align: 'center',
            render: (products = []) => (
                <Avatar.Group maxCount={5} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                    {products.map((product, index) => (
                        <Tooltip
                            key={index}
                            title={product.name}
                            placement="top"
                        >
                            <Avatar
                                src={product.primary_image ? `${BASE_URL}/${product.primary_image}` : ''}
                                shape="circle"
                                alt={product.name}
                            >
                                {product.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    ))}
                </Avatar.Group>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            pagination={false}
            loading={loading}
            scroll={{ x: true }}
            bordered
            size="middle"
        />
    );
};

export default SectionTable;
