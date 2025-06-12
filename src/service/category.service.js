import { axiosInstance } from "../lib/axios.config";

export const addCategory = async (data) => {
  return await axiosInstance.post(`/api/v1/admin/categories/create?request-id=1234`, data);
};

export const getAllCategories = async () => {
  return await axiosInstance.get(
    "/api/v1/open/categories/get/all?page=0&size=1000&request-id=1234"
  );
};

export const updateCategory = async (data) => {
  return await axiosInstance.put(`/api/v1/admin/categories/update?request-id=1234`, data);
};

export const deleteCategory = async (categoryId) => {
  return await axiosInstance.delete(
    `/api/v1/admin/categories/delete/${categoryId}?request-id=1234`
  );
};
