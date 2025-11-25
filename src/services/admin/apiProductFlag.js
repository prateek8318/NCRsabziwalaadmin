import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getAllFlagProduct = async (type) => {
    try {
        const response = await axiosInstance.get(`/api/admin/product/flag/list?type=${type}`);
        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error)
        // message.error('Error fetching order');
    }
}

export const toggleProductFlag = async (productId, field) => {
    try {
        const response = await axiosInstance.post("/api/admin/product/flag/toggle", { productId, field });
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching order');
    }
}