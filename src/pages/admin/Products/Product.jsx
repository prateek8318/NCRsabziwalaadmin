import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, message } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import ProductTable from './components/ProductTable';
import { getAllProducts } from '../../../services/admin/apiProduct';

const Product = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate()

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const productList = await getAllProducts();
            setProducts(productList || []);
        } catch {
            message.error('Error fetching product list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProduct(); }, []);

    const handleDelete = (product) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: `This will permanently delete "${product.name}"`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: () => deleteProductFn(product._id),
        });
    };

    const deleteProductFn = async (id) => {
        try {
            // await deleteProduct(id);
            fetchProduct();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by food product name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                />
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    size="large"
                    onClick={() => navigate('add')}
                >
                    Add Product
                </Button>
            </div>

            <ProductTable
                searchText={searchText}
                data={products}
                onDelete={handleDelete}
                loading={loading}
            />

        </>
    );
};

export default Product;
