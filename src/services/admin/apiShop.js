import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getShop = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/shop/list`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching shop list');
    }
}

export const deleteShop = async(shopId)=>{
    // console.log(shopId)
    try {
        const response = await axiosInstance.delete(`/api/admin/shop/delete/${shopId}`);
        return response.data.data;
    } catch (error) {
        message.error('Error deleting shop');
    }
}