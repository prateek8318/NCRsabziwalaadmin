import axiosInstance from "../../utils/axiosInstance";


export const addProduct = async (formData) => {
    const response = await axiosInstance.post("/api/admin/product", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};



export const getAllProducts = async () => {
    const response = await axiosInstance(`/api/admin/product/list`);
    return response.data.data;
}



export const updateProduct = async (id, formData) => {
    const response = await axiosInstance.patch(`/api/admin/product/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};



export const getProductDetail = async (id) => {
    const response = await axiosInstance.get(`/api/admin/product/${id}`);
    return response.data.data;
}