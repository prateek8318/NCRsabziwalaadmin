import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

// Get all SOS requests with pagination and filtering
export const getAllSosRequests = async (params = {}) => {
    try {
        const { status, page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        
        if (status) queryParams.append('status', status);
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        const response = await axiosInstance.get(`/api/admin/sos?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SOS requests:', error);
        message.error(error.response?.data?.message || 'Error fetching SOS requests');
        throw error;
    }
};

// Get specific SOS request details
export const getSosRequestDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/sos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SOS request details:', error);
        message.error(error.response?.data?.message || 'Error fetching SOS request details');
        throw error;
    }
};

// Update SOS request status and details
export const updateSosRequest = async (id, updateData) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/sos/${id}`, updateData);
        message.success('SOS request updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating SOS request:', error);
        message.error(error.response?.data?.message || 'Error updating SOS request');
        throw error;
    }
};
