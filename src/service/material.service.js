import { axiosInstance } from "../lib/axios.config";

export const addMaterial = async (data) => {
  return await axiosInstance.post(`/api/v1/admin/materials/add?request-id=1234`, data);
};

export const getAllMaterials = async () => {
  return await axiosInstance.get(
    "/api/v1/admin/materials/get?page-number=0&page-size=1000&request-id=1234"
  );
};
