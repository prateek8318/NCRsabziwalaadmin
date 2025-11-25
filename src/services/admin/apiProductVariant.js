import axiosInstance from "../../utils/axiosInstance";


export const addProductVarient = async (productId, formData) => {
    const response = await axiosInstance.post(`/api/admin/product/${productId}/add-varient`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};



export const getAllProductVarients = async (productId) => {
    const response = await axiosInstance.get(`/api/admin/product/${productId}/get-varient`);
    return response.data.data;
}



export const updateProductVarient = async (productId, varientId, formData) => {
    const response = await axiosInstance.patch(`/api/admin/product/${productId}/update-varient/${varientId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
}



export const deleteProductVarientImage = async (productId, varientId, imagePath) => {
    const response = await axiosInstance.post(`/api/admin/product/${productId}/delete-varient-image/${varientId}`, {imagePath});
    return response.data.data;
}



export const deleteProductVarient = async (productId, varientId) => {
    const response = await axiosInstance.delete(`/api/admin/product/${productId}/delete-varient/${varientId}`);
    return response.data.data;
}