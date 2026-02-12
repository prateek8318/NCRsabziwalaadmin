import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

// Get SOS settings
export const getSosSettings = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/sos-settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching SOS settings:', error);
        message.error(error.response?.data?.message || 'Error fetching SOS settings');
        throw error;
    }
};

// Update SOS settings
export const updateSosSettings = async (settingsData) => {
    try {
        const response = await axiosInstance.patch('/api/admin/sos-settings', settingsData);
        message.success('SOS settings updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating SOS settings:', error);
        message.error(error.response?.data?.message || 'Error updating SOS settings');
        throw error;
    }
};
