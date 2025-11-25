import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getAllProductOfStore199 = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/store199/product`);
        return response.data;
    } catch (error) {
        // console.log(error)
    }
}

export const getAllProductOfStore199ForAssign = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/store199/product/all`);
        return response.data;
    } catch (error) {
        // console.log(error)
    }
}

export const bulkProductAddInStore199 = async (data) => {
    try {
        const response = await axiosInstance.post("/api/admin/store199/product/bulk", data);
        message.success('product added');
        return response.data;
    } catch (error) {
        message.error('Error adding product');
    }
}

export const deleteProductOfStore199 = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/store199/product/${id}`);
        message.success('product deleted');
        return response.data;
    } catch (error) {
        message.error('Error deleting product');
    }
}