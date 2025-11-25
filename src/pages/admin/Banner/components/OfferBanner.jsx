import React from 'react';
import { Card, Table, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function OfferBanner() {
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
            title: 'Offer Details',
            dataIndex: 'offerDetails',
            key: 'offerDetails',
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
                title="Offer Banners"
                extra={
                    <Upload
                        name="banner"
                        action="/api/upload"
                        onChange={handleUpload}
                        showUploadList={false}
                    >
                        <Button type="primary" icon={<UploadOutlined />}>
                            Add New Offer Banner
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

export default OfferBanner; 