import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllCoupon = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/coupon')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        console.log(error)
        message.error('Error fetching category list');
    }
}
export const addCoupon = async (data) => {
  try {
    const response = await axiosInstance.post('/api/admin/coupon', data);
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 'Error adding coupon';
    message.error(errorMsg);
    throw error;
  }
};
// ✅ FIXED VERSION
export const updateCoupon = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/api/admin/coupon/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update coupon";
  }
};

export const updateStatus = async (id, status) => {
    status = status ? "active" : "inactive"
    try {
        const response = await axiosInstance.patch(`/api/admin/coupon/${id}`, { status });
        message.success('category status update');
        return response;
    } catch (error) {
        message.error('Error updating category status');
    }
}
export const deleteCoupon = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/coupon/${id}`);
        return response;
    } catch (error) {
        message.error('Error deleteing category');
    }
}
