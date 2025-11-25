import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllDrivers = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/driver/list')
    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error('Error fetching category list');
  }
}

export const updateDriverStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/api/admin/driver/block/${id}`, { status });
    message.success('driver status update');
    return response;
  } catch (error) {
    message.error('Error updating driver status');
  }
}

export const addDriver = async (data) => {
  try {
    const response = await axiosInstance.post('/api/admin/driver/create', data);
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 'Error adding coupon';
    message.error(errorMsg);
    throw error;
  }
};