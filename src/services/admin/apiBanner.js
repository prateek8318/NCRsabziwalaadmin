import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllBanner = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/banner/list')
        // console.log(response.data.data)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching banner list');
    }
}

export const addBanner = async (formData) => {
    //  console.log(formData);
    //  return;
    try {
        const response = await axiosInstance.post('/api/admin/banner/create', formData, { headers: { "Content-Type": "multipart/form-data" } });
        // console.log(response)
        return response;
    } catch (error) {
        message.error('Error adding banner');
    }
}

export const deleteBanner = async (id) => {
    await axiosInstance.delete(`/api/admin/banner/delete/${id}`);
}

