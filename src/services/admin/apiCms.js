import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

// Terms & Conditions API
export const getAllTermsConditions = async (type) => {
    try {
        const url = type ? `/api/admin/terms-conditions?type=${type}` : '/api/admin/terms-conditions';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching terms & conditions:', error);
        message.error(error.response?.data?.message || 'Error fetching terms & conditions');
        throw error;
    }
};

export const createTermsConditions = async (data) => {
    try {
        const response = await axiosInstance.post('/api/admin/terms-conditions', data);
        message.success('Terms and conditions created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating terms & conditions:', error);
        message.error(error.response?.data?.message || 'Error creating terms & conditions');
        throw error;
    }
};

export const updateTermsConditions = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/terms-conditions/${id}`, data);
        message.success('Terms and conditions updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating terms & conditions:', error);
        message.error(error.response?.data?.message || 'Error updating terms & conditions');
        throw error;
    }
};

export const deleteTermsConditions = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/terms-conditions/${id}`);
        message.success('Terms and conditions deleted successfully');
        return response.data;
    } catch (error) {
        console.error('Error deleting terms & conditions:', error);
        message.error(error.response?.data?.message || 'Error deleting terms & conditions');
        throw error;
    }
};

// Privacy Policy API
export const getAllPrivacyPolicies = async (type) => {
    try {
        const url = type ? `/api/admin/privacy-policy?type=${type}` : '/api/admin/privacy-policy';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching privacy policies:', error);
        message.error(error.response?.data?.message || 'Error fetching privacy policies');
        throw error;
    }
};

export const createPrivacyPolicy = async (data) => {
    try {
        const response = await axiosInstance.post('/api/admin/privacy-policy', data);
        message.success('Privacy policy created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating privacy policy:', error);
        message.error(error.response?.data?.message || 'Error creating privacy policy');
        throw error;
    }
};

export const updatePrivacyPolicy = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/privacy-policy/${id}`, data);
        message.success('Privacy policy updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating privacy policy:', error);
        message.error(error.response?.data?.message || 'Error updating privacy policy');
        throw error;
    }
};

export const deletePrivacyPolicy = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/privacy-policy/${id}`);
        message.success('Privacy policy deleted successfully');
        return response.data;
    } catch (error) {
        console.error('Error deleting privacy policy:', error);
        message.error(error.response?.data?.message || 'Error deleting privacy policy');
        throw error;
    }
};

// Refund Policy API
export const getAllRefundPolicies = async (type) => {
    try {
        const url = type ? `/api/admin/refund-policy?type=${type}` : '/api/admin/refund-policy';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching refund policies:', error);
        message.error(error.response?.data?.message || 'Error fetching refund policies');
        throw error;
    }
};

export const createRefundPolicy = async (data) => {
    try {
        const response = await axiosInstance.post('/api/admin/refund-policy', data);
        message.success('Refund policy created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating refund policy:', error);
        message.error(error.response?.data?.message || 'Error creating refund policy');
        throw error;
    }
};

export const updateRefundPolicy = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/refund-policy/${id}`, data);
        message.success('Refund policy updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating refund policy:', error);
        message.error(error.response?.data?.message || 'Error updating refund policy');
        throw error;
    }
};

export const deleteRefundPolicy = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/refund-policy/${id}`);
        message.success('Refund policy deleted successfully');
        return response.data;
    } catch (error) {
        console.error('Error deleting refund policy:', error);
        message.error(error.response?.data?.message || 'Error deleting refund policy');
        throw error;
    }
};

// About Us API
export const getAllAboutUs = async (type) => {
    try {
        const url = type ? `/api/admin/about-us?type=${type}` : '/api/admin/about-us';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching about us:', error);
        message.error(error.response?.data?.message || 'Error fetching about us');
        throw error;
    }
};

export const createAboutUs = async (data) => {
    try {
        const response = await axiosInstance.post('/api/admin/about-us', data);
        message.success('About us created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating about us:', error);
        message.error(error.response?.data?.message || 'Error creating about us');
        throw error;
    }
};

export const updateAboutUs = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/about-us/${id}`, data);
        message.success('About us updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating about us:', error);
        message.error(error.response?.data?.message || 'Error updating about us');
        throw error;
    }
};

export const deleteAboutUs = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/about-us/${id}`);
        message.success('About us deleted successfully');
        return response.data;
    } catch (error) {
        console.error('Error deleting about us:', error);
        message.error(error.response?.data?.message || 'Error deleting about us');
        throw error;
    }
};

// Legacy functions for backward compatibility
export const getAllCms = async (type) => {
    try {
        const response = await axiosInstance.get(`/api/admin/cms?type=${type}`);
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
};

export const updateCms = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/cms/${id}`, data)
        return response.data;
    } catch (error) {
        message.error('Error updating setting');
    }
};

// Driver-specific CMS API functions
export const getDriverTermsConditions = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/terms-conditions?type=driver');
        return response.data;
    } catch (error) {
        console.error('Error fetching driver terms & conditions:', error);
        message.error(error.response?.data?.message || 'Error fetching driver terms & conditions');
        throw error;
    }
};

export const getDriverPrivacyPolicy = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/privacy-policy?type=driver');
        return response.data;
    } catch (error) {
        console.error('Error fetching driver privacy policy:', error);
        message.error(error.response?.data?.message || 'Error fetching driver privacy policy');
        throw error;
    }
};

export const getDriverRefundPolicy = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/refund-policy?type=driver');
        return response.data;
    } catch (error) {
        console.error('Error fetching driver refund policy:', error);
        message.error(error.response?.data?.message || 'Error fetching driver refund policy');
        throw error;
    }
};

export const getDriverAboutUs = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/about-us?type=driver');
        return response.data;
    } catch (error) {
        console.error('Error fetching driver about us:', error);
        message.error(error.response?.data?.message || 'Error fetching driver about us');
        throw error;
    }
};