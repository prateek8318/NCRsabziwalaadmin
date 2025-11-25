import { message } from "antd"
import axiosInstance from "../utils/axiosInstance";

export const getAllSettings = async () => {
    try {
        const response = await axiosInstance.get("/api/admin/settings");
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const updateSettings = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/settings/update/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        return response.data;
    } catch (error) {
        message.error('Error updating setting');
    }
}