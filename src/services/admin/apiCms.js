import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";


export const getAllCms = async (type) => {
    try {
        const response = await axiosInstance.get(`/api/admin/cms?type=${type}`);
        // console.log(response)
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const updateCms = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/cms/${id}`, data)
        return response.data;
    } catch (error) {
        message.error('Error updating setting');
    }
}