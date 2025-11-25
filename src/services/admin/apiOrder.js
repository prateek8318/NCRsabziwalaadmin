import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getAllOrder = async (type) => {
    const response = await axiosInstance.get(`/api/admin/order?orderStatus=${type}`);
    return response.data;
}


export const getAllOrdersCount = async () => {
    const response = await axiosInstance.get(`/api/admin/order/count`);
    return response.data;
}


export const getOrderDetails = async (id) => {
    const response = await axiosInstance.get(`/api/admin/order/${id}`);
    return response.data;
}



export const downloadInvoice = async (id) => {
    const response = await axiosInstance.get(`/api/admin/invoice/${id}`, {
        responseType: 'blob', 
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
};




export const getAllDrivers = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/neworder/${id}/driverlist`)
        // console.log(response.data.data)
        return response.data;
    } catch (error) {
        console.log(error)
        message.error('Error fetching category list');
    }
}

export const assignDriver = async (id, driverId) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/neworder/assign/${id}`, { driverId });
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error(error.response.data.message || 'Error assigning order');
    }
}

// --------- working ---------
// export const changeOrderStatus = async (id, data) => {
//     // console.log(id, data);
//     // console.log("---------------------------------");
//     // return;
//     try {
//         const response = await axiosInstance.post(`/api/vendor/order/status/${id}`, data);
//         // console.log(response.data)
//         return response.data;
//     } catch (error) {
//         // console.log(error)
//         message.error('Error fetching order');
//     }
// }