import { message } from "antd"
import axiosInstance from "../utils/axiosInstance";

export const getPolicies = async () => {
    try {
        const response = await axiosInstance.get("/api/user/cms");
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}