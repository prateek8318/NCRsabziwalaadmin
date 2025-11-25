import { Card, List, Avatar, Tag } from 'antd';
import { FaUser } from 'react-icons/fa';

// Status color mapping
const statusColors = {
    active: { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
    inactive: { color: '#1890ff', bg: '#f0f5ff', border: '#adc6ff' },
    Expired: { color: '#faad14', bg: '#fffbe6', border: '#ffe58f' },
    Declined: { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e' },
};

function StatusTag({ status }) {
    const st = statusColors[status] || { color: '#595959', bg: '#fafafa', border: '#e0e0e0' };
    return (
        <Tag
            style={{
                color: st.color,
                background: st.bg,
                borderColor: st.border,
                fontWeight: 500,
                borderRadius: 16,
                padding: '2px 14px',
                fontSize: 14,
            }}
            bordered
        >
            {status}
        </Tag>
    );
}

function NewUserList({ data, loading }) {
    return (
        <Card
            title={<span style={{ fontWeight: 700, fontSize: 18 }}>New User</span>}
            style={{
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                minWidth: 320,
            }}
            styles={{ padding: 18 }}
            loading={loading}
        >
            <div
                style={{
                    maxHeight: 350, // Adjust as needed for your item height; ~10 items
                    overflowY: 'auto',
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    split={false}
                    renderItem={item => (
                        <List.Item style={{ padding: '18px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<FaUser />}
                                        style={{ width: 48, height: 48, marginRight: 16 }}
                                    />
                                }
                                title={
                                    <span style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>
                                        {item.name}
                                    </span>
                                }
                                description={
                                    <span style={{ color: '#757575', fontSize: 15 }}>
                                        {item.email}
                                    </span>
                                }
                            />
                            <div style={{ textAlign: 'right', minWidth: 120 }}>
                                {/* <StatusTag status={item.status} /> */}
                                <div style={{ marginTop: 6, color: '#757575', fontSize: 15 }}>
                                    {item.mobileNo}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </Card>
    );
}

export default NewUserList;
