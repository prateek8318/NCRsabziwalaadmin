import React from 'react';
import { Card, Table, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function Store199Banner() {
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) => (
                <img src={text} alt="banner" style={{ width: 100, height: 50, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button type="primary" size="small">Edit</Button>
                    <Button danger size="small">Delete</Button>
                </div>
            ),
        },
    ];

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <div>
            <Card
                title="199 Store Banners"
                extra={
                    <Upload
                        name="banner"
                        action="/api/upload"
                        onChange={handleUpload}
                        showUploadList={false}
                    >
                        <Button type="primary" icon={<UploadOutlined />}>
                            Add New 199 Store Banner
                        </Button>
                    </Upload>
                }
            >
                <Table
                    columns={columns}
                    dataSource={[]}
                    rowKey="id"
                />
            </Card>
        </div>
    );
}

export default Store199Banner; 