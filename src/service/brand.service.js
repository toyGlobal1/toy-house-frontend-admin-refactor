import { axiosInstance } from "../lib/axios.config";

export const addBrand = async (data) => {
  return await axiosInstance.post(`/api/v1/admin/brands/add?request-id=1234`, data);
};

export const getAllBrands = async () => {
  return await axiosInstance.get("/api/v1/open/brands/get/all?page=0&size=1000&request-id=1234");
};

export const updateBrand = async (data) => {
  return await axiosInstance.put(`/api/v1/admin/brands/update?request-id=1234`, data);
};

export const deleteBrand = async (brandId) => {
  return await axiosInstance.delete(`/api/v1/admin/brands/delete/${brandId}?request-id=1234`);
};
