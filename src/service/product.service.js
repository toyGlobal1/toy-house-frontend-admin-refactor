import { axiosInstance } from "../lib/axios.config";

export const getAllProducts = async () => {
  return await axiosInstance.get(
    "/api/v1/open/products/get/products/for-dashboard?page-number=1&page-size=10&request-id=1212"
  );
};

export const getProductCategories = async () => {
  return await axiosInstance.get(
    "api/v1/open/categories/get/all?page-number=1&page-size=1000&request-id=1212112"
  );
};

export const getProductBrands = async () => {
  return await axiosInstance.get(
    "api/v1/open/brands/get/all?page-number=1&page-size=1000&request-id=1212112"
  );
};
