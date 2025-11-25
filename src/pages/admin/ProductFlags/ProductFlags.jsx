import React, { useState, useEffect } from 'react';
import { Table, Switch, Tooltip, Card, Segmented } from 'antd';
import { getAllFlagProduct, toggleProductFlag } from '../../../services/admin/apiProductFlag';

const ProductFlags = () => {
    const [type, setType] = useState('food');
    const [food, setFood] = useState([]);
    const [grocery, setGrocery] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data when type changes
    useEffect(() => {
        fetchProductList(type);
    }, [type]);

    // Fetch product list from API
    const fetchProductList = async (type) => {
        setLoading(true);
        try {
            const res = await getAllFlagProduct(type);
            const formattedData = res.data.map((item) => ({
                key: item._id,
                ...item,
            }));

            if (type === 'food') {
                setFood(formattedData);
            } else {
                setGrocery(formattedData);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle toggle switch (currently refetches data only)
    const handleToggle = async (productId, field) => {
        // console.log(`Toggling ${field} for productId:`, productId);
    
        try {
            await toggleProductFlag(productId, field); 
            fetchProductList(type); 
        } catch (error) {
            console.error("Error toggling flag:", error);
        }
    };

    // Base columns (common)
    const baseColumns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-medium text-base">{text}</span>,
        },
        {
            title: 'Vendor',
            dataIndex: 'vendorName',
            key: 'vendorName',
        },
        {
            title: 'Shop',
            dataIndex: 'shopName',
            key: 'shopName',
        },
    ];

    // Food-specific flag columns
    const foodColumns = [
        {
            title: 'Recommended',
            dataIndex: 'isRecommended',
            key: 'isRecommended',
            render: (_, record) => (
                <Tooltip title="Recommended">
                    <Switch
                        checked={record.isRecommended}
                        onChange={() => handleToggle(record.key, 'isRecommended')}
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Featured',
            dataIndex: 'isFeatured',
            key: 'isFeatured',
            render: (_, record) => (
                <Tooltip title="Featured">
                    <Switch
                        checked={record.isFeatured}
                        onChange={() => handleToggle(record.key, 'isFeatured')}
                    />
                </Tooltip>
            ),
        },
    ];

    // Grocery-specific flag columns
    const groceryColumns = [
        {
            title: 'Featured',
            dataIndex: 'isFeatured',
            key: 'isFeatured',
            render: (_, record) => (
                <Tooltip title="Featured">
                    <Switch
                        checked={record.isFeatured}
                        onChange={() => handleToggle(record.key, 'isFeatured')}
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Seasonal',
            dataIndex: 'isSeasonal',
            key: 'isSeasonal',
            render: (_, record) => (
                <Tooltip title="Seasonal">
                    <Switch
                        checked={record.isSeasonal}
                        onChange={() => handleToggle(record.key, 'isSeasonal')}
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Vegetable of the Day',
            dataIndex: 'isVegetableOfTheDay',
            key: 'isVegetableOfTheDay',
            render: (_, record) => (
                <Tooltip title="Vegetable of the Day">
                    <Switch
                        checked={record.isVegetableOfTheDay}
                        onChange={() => handleToggle(record.key, 'isVegetableOfTheDay')}
                    />
                </Tooltip>
            ),
        },
        {
            title: 'Fruit of the Day',
            dataIndex: 'isFruitOfTheDay',
            key: 'isFruitOfTheDay',
            render: (_, record) => (
                <Tooltip title="Fruit of the Day">
                    <Switch
                        checked={record.isFruitOfTheDay}
                        onChange={() => handleToggle(record.key, 'isFruitOfTheDay')}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card className="rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Manage Product Flags</h2>
                    <Segmented
                        options={['food', 'grocery']}
                        value={type}
                        onChange={setType}
                    />
                </div>
                <Table
                    columns={[
                        ...baseColumns,
                        ...(type === 'food' ? foodColumns : groceryColumns),
                    ]}
                    dataSource={type === 'food' ? food : grocery}
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default ProductFlags;
