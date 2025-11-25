import React, { useState, useMemo } from 'react';
import { Table, Tag, Space, Button, Modal, Tooltip } from 'antd';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { convertDate } from '../../../../utils/formatDate';

const statusColors = { approved: 'green', pending: 'orange', rejected: 'red' };

export default function PaymentRequestTable({ data, searchText, loading, changeStatus, onSettle, }) {
    const nav = useNavigate();
    const [view, setView] = useState(null);
    const close = () => setView(null);

    const columns = useMemo(() => [
        { title: 'Sr No', key: 'sr', align: 'center', render: (_, _r, i) => i + 1 },
        { title: 'Amount', dataIndex: 'amount_requested', key: 'amt', align: 'center', render: a => `₹ ${a}` },
        { title: 'Date', dataIndex: 'request_date', key: 'date', align: 'center', render: d => convertDate(d) },
        {
            title: 'Message', dataIndex: 'message', key: 'msg', align: 'center',
            render: text => (
                <div className="max-w-xs truncate">
                    <Tooltip title={text || "-"}>{text || "-"}</Tooltip>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'st',
            align: 'center',
            render: s => <Tag color={statusColors[s]} className="uppercase">{s}</Tag>
        },
        {
            title: 'Settled',
            dataIndex: 'admin_settled',
            key: 'set',
            align: 'center',
            render: (s, r) => (
                <div>
                    <Tag color={s ? 'green' : 'red'}>{s ? 'Yes' : 'No'}</Tag> <br />
                    {s && <Tag color="green">{convertDate(r.updatedAt)}</Tag>}
                </div>
            )
        },
        {
            title: 'User',
            key: 'user',
            align: 'center',
            render: r => {
                const isVendor = !!r.vendorId;
                const user = r.vendorId || r.driverId;
                return (
                    <Button
                        type="link"
                        className="p-0"
                        onClick={() => nav(`/admin/${isVendor ? 'vendor' : 'driver'}/${user._id}`)}
                    >
                        {user.name}
                    </Button>
                );
            }
        },
        {
            title: 'Balance',
            key: 'bal',
            align: 'center',
            render: r => {
                const user = r.vendorId || r.driverId;
                return `₹ ${user.wallet_balance}`;
            }
        },
        {
            title: 'Action',
            key: 'act',
            align: 'center',
            render: (_, r) => {
                if (r.status === 'pending') {
                    return (
                        <Space size="small">
                            <Button icon={<FaCheck />} onClick={() => changeStatus(r, "approved")} />
                            <Button danger icon={<FaTimes />} onClick={() => changeStatus(r, "rejected")} />
                        </Space>
                    );
                }
                if (r.status === 'approved' && !r.admin_settled) {
                    return <Button onClick={() => onSettle(r)}>Settle</Button>;
                }
                if ((r.status === 'approved' && r.admin_settled) || r.status === 'rejected') {
                    return <Button icon={<IoMdEye />} onClick={() => setView(r)} />;
                }
                return null;
            }
        },
    ], [nav, changeStatus, onSettle, loading]);


    return (
        <>
            <Table
                rowKey="_id"
                loading={loading}
                bordered
                size="small"
                scroll={{ x: true }}
                dataSource={data.filter(d => d._id.includes(searchText))}
                columns={columns}
            />

            <Modal
                title="Request Details"
                open={!!view}
                footer={<Button onClick={close}>Close</Button>}
                onCancel={close}
            >
                {view && (
                    <div className="space-y-2">
                        {[
                            ['Name', view.vendorId?.name || view.driverId?.name],
                            ['Amount', `₹ ${view.amount_requested}`],
                            // ['Driver',  view.driverId?.name || '—'],
                            ['Balance', `₹ ${view.vendorId?.wallet_balance || view.driverId?.wallet_balance || 0}`],
                            ['Date', convertDate(view.request_date)],
                            ['Message', view.message || '—'],
                            ['Status', <Tag color={statusColors[view.status]}>{view.status.toUpperCase()}</Tag>],
                            ['Settled', view.admin_settled ? `Yes on ${convertDate(view.updatedAt)}` : 'No']
                        ].map(([label, val], index) => (
                            <p key={label + '-' + index}>
                                <strong>{label}:</strong> {val}
                            </p>
                        ))}
                    </div>
                )}
            </Modal>

        </>
    );
}
