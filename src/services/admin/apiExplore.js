import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getAllExplore = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/exploresection");
    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching explore list");
  }
};

export const addExplore = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/exploresection",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    message.error("Error adding banner");
  }
};

export const updateExplore = async (id, formData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/exploresection/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  } catch (error) {
    message.error("Error adding banner");
  }
};

export const detailsExplore = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/exploresection/${id}`);
    return response.data;
  } catch (error) {
    message.error("Error adding banner");
  }
};

export const deleteExplore = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/exploresection/${id}`
    );
    return response;
  } catch (error) {
    message.error("Error adding banner");
  }
};

export const getAllExploreProduct = async (type) => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/exploresection/products`
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching order");
  }
};

export const createExploreSection = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/exploresection",
      formData
    );
    return response;
  } catch (error) {
    message.error("Error adding banner");
  }
};

export const getSectionsByExplore = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/explore/${id}/section`
    );
    return response.data;
  } catch (error) {
    message.error("Error fetching explore sections");
  }
};

export const assignProductsToExploreSection = async (data) => {
  // console.log(data.exploreSectionId)
  // console.log("----------------")
  // console.log(data.productIds)
  try {
    const response = await axiosInstance.post(
      `/api/admin/exploresection/assign/product`,
      data
    );
    return response.data;
  } catch (error) {
    message.error("Error fetching explore sections");
  }
};

export const deleteProductFromExploreSection = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/exploresection/product`,
      data
    );
    return response.data;
  } catch (error) {
    message.error("Error fetching explore sections");
  }
};

export const deleteSection = async () => {
  console.log("working");
};

export const createSection = async () => {
  console.log("working");
};
