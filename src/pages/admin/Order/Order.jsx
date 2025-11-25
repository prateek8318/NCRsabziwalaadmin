import { Input, message, Tabs, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import OrderTable from './components/OrderTable';
import { getAllOrdersCount } from '../../../services/admin/apiOrder';

function Order() {
    const [searchText, setSearchText] = useState('');
    const [orderCounts, setOrderCounts] = useState({});
    const [orderType, setOrderType] = useState('pending');

    useEffect(() => {
        fetchOrderCounts();
    }, []);

    const fetchOrderCounts = async () => {
        try {
            const res = await getAllOrdersCount();
            setOrderCounts(res.counts || {});
        } catch (error) {
            message.error("Error fetching order count");
        }
    };

    const tabWithCount = (label, key) => ({
        label: (
            <span>
                {label}{' '}
                <Badge
                    count={orderCounts?.[key] || 0}
                    showZero
                    style={{ backgroundColor: '#1890ff' }}
                />
            </span>
        ),
        key
    });

    const tabs = [
        tabWithCount('Pending Orders', 'pending'),
        tabWithCount('Accepted Orders', 'accepted'),
        tabWithCount('Ready Orders', 'ready'),
        tabWithCount('Assigned Orders', 'shipped'),
        tabWithCount('Running Orders', 'out_for_delivery'),
        tabWithCount('Delivered Orders', 'delivered'),
        tabWithCount('Cancel Orders', 'cancelled'),
        tabWithCount('All Orders', 'all'),
    ];

    return (
        <>
            <div className='lg:px-10 px-5 my-8'>
                <div className='md:flex items-center gap-4 justify-between'>
                    <Input.Search
                        placeholder="Search by name"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 300, borderRadius: '6px' }}
                        size="large"
                    />
                </div>

                <Tabs
                    items={tabs}
                    activeKey={orderType}
                    onChange={setOrderType}
                    className="mt-6"
                />
            </div>

            <OrderTable searchText={searchText} type={orderType} />
        </>
    );
}

export default Order;
