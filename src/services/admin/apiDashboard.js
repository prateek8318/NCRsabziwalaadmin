import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getDashboard = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching dashboard data');
    }
}



export const getRecentTransaction = async () => {
    const response = await axiosInstance.get(`/api/admin/recent-transactions`);
    // Handle different response structures
    const data = response.data;
    return data.orders || data.data?.orders || data.data || data || [];
}



export const getNewUser = async () => {
    const response = await axiosInstance.get(`/api/admin/new-users`);
    // Handle different response structures
    const data = response.data.data;
    return data.users || data || [];
}