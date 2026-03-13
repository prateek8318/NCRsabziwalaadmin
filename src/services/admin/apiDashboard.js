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

export const getSalesChart = async (range = 7) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/sales-chart?range=${range}`);
        return response.data.data || response.data;
    } catch (error) {
        message.error('Error fetching sales chart data');
        return [];
    }
}

export const getEarningChart = async (range = 7) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/earning-chart?range=${range}`);
        console.log('Earning Chart API Response:', response.data);
        return response.data.data || response.data;
    } catch (error) {
        message.error('Error fetching earning chart data');
        return [];
    }
}

export const getOrderChart = async (range = 7) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/order-chart?range=${range}`);
        console.log('Order Chart API Response:', response.data);
        return response.data.data || response.data;
    } catch (error) {
        message.error('Error fetching order chart data');
        return [];
    }
}