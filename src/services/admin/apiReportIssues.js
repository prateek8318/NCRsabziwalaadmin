import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

// Get all report issues with pagination and filtering
export const getAllReportIssues = async (params = {}) => {
    try {
        const { status, incidentType, priority, isEmergency, page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams();
        
        if (status) queryParams.append('status', status);
        if (incidentType) queryParams.append('incidentType', incidentType);
        if (priority) queryParams.append('priority', priority);
        if (isEmergency !== undefined) queryParams.append('isEmergency', isEmergency);
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        const response = await axiosInstance.get(`/api/admin/report-issues?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report issues:', error);
        message.error(error.response?.data?.message || 'Error fetching report issues');
        throw error;
    }
};

// Get specific report issue details
export const getReportIssueDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/report-issues/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report issue details:', error);
        message.error(error.response?.data?.message || 'Error fetching report issue details');
        throw error;
    }
};

// Update report issue
export const updateReportIssue = async (id, updateData) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/report-issues/${id}`, updateData);
        message.success('Report issue updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating report issue:', error);
        message.error(error.response?.data?.message || 'Error updating report issue');
        throw error;
    }
};
