import { axiosInstance } from "../lib/axios.config";

export const addColor = async (data) => {
  return await axiosInstance.post(`/api/v1/admin/colors/create?request-id=1234`, data);
};

export const getAllColors = async () => {
  return await axiosInstance.get(
    "/api/v1/admin/colors/get?page-number=0&page-size=1000&request-id=1234"
  );
};

export const deleteColor = async (colorId) => {
  return await axiosInstance.delete(`/api/v1/admin/colors/delete/${colorId}?request-id=1234`);
};
