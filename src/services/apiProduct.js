import { message } from "antd";
import axiosInstance from "@utils/axiosInstance"

export const addProduct = async (formData) => {
    const response = await axiosInstance.post("/api/admin/product/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// export const getAllProducts = async () => {
//     try {
//         const response = await axiosInstance(`/api/admin/product/list`);
//         return response.data.data;
//     } catch (error) {
//         message.error('Error fetching product list');
//     }
// }

export const getAllProducts = async (type) => {
    try {
        const response = await axiosInstance(`/api/admin/product/list?type=${type}`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching product list');
    }
}

export const getProductDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/product/${id}`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching product details');
    }
}

export const updateProduct = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(
            `/api/admin/product/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        message.success('Product updated successfully!');
        return response.data.data;
    } catch (error) {
        message.error('Error updating product');
        throw error;
    }
};

export const updateProductStatus = async (id, status) => {
    status = status ? "active" : "inactive"
    try {
        const response = await axiosInstance.patch(`/api/admin/product/${id}/toggle-status`, { status });
        message.success('product status update');
        return response.data.data;
    } catch (error) {
        message.error('Error updating product status');
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/product/${id}`);
        message.success('product deleted');
        return response.data;
    } catch (error) {
        message.error('Error deleting product');
    }
}