import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllDrivers = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/driver/list');
        return response.data;
    } catch (error) {
        message.error('Error fetching driver list');
        throw error;
    }
}

export const getDriverDetails = async (driverId) => {
    try {
        const response = await axiosInstance.get(`/api/admin/driver/details/${driverId}`);
        return response.data;
    } catch (error) {
        message.error('Error fetching driver details');
        throw error;
    }
}

export const toggleDriverVerification = async (driverId, status) => {
    try {
        console.log('API: Toggling driver verification:', driverId, 'to status:', status);
        const response = await axiosInstance.patch(`/api/admin/driver/verify/${driverId}`, { status });
        console.log('API: Verification toggle response:', response.data);
        message.success('Driver verification status updated');
        return response.data;
    } catch (error) {
        console.error('API: Error updating driver verification:', error);
        message.error('Error updating driver verification');
        throw error;
    }
}

export const toggleDriverBlock = async (driverId) => {
    try {
        console.log('API: Toggling driver block for:', driverId);
        const response = await axiosInstance.patch(`/api/admin/driver/block/${driverId}`);
        console.log('API: Driver block toggle response:', response.data);
        message.success('Driver block status updated');
        return response.data;
    } catch (error) {
        console.error('API: Error updating driver block status:', error);
        message.error('Error updating driver block status');
        throw error;
    }
}

export const getDriverWalletRequests = async () => {
    try {
        console.log('API: Fetching driver wallet requests');
        const response = await axiosInstance.get('/api/admin/wallet/request?type=driver');
        console.log('API: Wallet requests response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API: Error fetching wallet requests:', error);
        message.error('Error fetching wallet requests');
        throw error;
    }
}

export const settleDriverWallet = async (driverId, amount = 0, remarks = '', type = 'wallet') => {
    try {
        console.log('API: Settling driver wallet for:', driverId, 'amount:', amount, 'remarks:', remarks, 'type:', type);
        const response = await axiosInstance.post(`/api/admin/driver/${driverId}/wallet/settle`, {
            amount,
            remarks,
            type
        });
        console.log('API: Wallet settlement response:', response.data);
        message.success(`Driver ${type} settled successfully`);
        return response.data;
    } catch (error) {
        console.error('API: Error settling driver wallet:', error);
        message.error(`Error settling driver ${type}`);
        throw error;
    }
}

export const getAvailableDriversForOrder = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/api/admin/order/${orderId}/driverlist`);
        return response.data;
    } catch (error) {
        message.error('Error fetching available drivers');
        throw error;
    }
}

export const assignDriverToOrder = async (orderId, driverId) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/order/assign/${orderId}`, { driverId });
        message.success('Order assigned to driver successfully');
        return response.data;
    } catch (error) {
        message.error('Error assigning driver to order');
        throw error;
    }
}

export const getDriverStatistics = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/driver/statistics');
        return response.data;
    } catch (error) {
        message.error('Error fetching driver statistics');
        throw error;
    }
}

export const approveDriver = async (driverId, approvalData) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/driver/approve/${driverId}`, approvalData);
        message.success('Driver approved successfully');
        return response.data;
    } catch (error) {
        message.error('Error approving driver');
        throw error;
    }
}

export const verifySettleWalletRequest = async (requestId, action, remark) => {
    try {
        const response = await axiosInstance.post(`/api/admin/wallet/request/verify-settle/${requestId}`, {
            action,
            remark
        });
        return response.data;
    } catch (error) {
        message.error(`Failed to ${action} wallet request`);
        throw error;
    }
}
