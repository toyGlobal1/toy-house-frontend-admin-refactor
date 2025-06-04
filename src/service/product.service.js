import { axiosInstance } from "../lib/axios.config";

export const getAllProducts = async () => {
  return await axiosInstance.get(
    "/api/v1/open/products/get/products/for-dashboard?page-number=0&page-size=1000&request-id=1212"
  );
};

export const deleteProduct = async (productId) => {
  return await axiosInstance.delete(`/api/v1/open/products/delete/${productId}?request-id=1234`);
};

export const getProductInventories = async (productId) => {
  return await axiosInstance.get(
    `/api/v1/admin/product/inventory/get/inventory-dashboard/${productId}?page-number=0&page-size=1000&request-id=1234`
  );
};

export const getProductDetails = async (productId) => {
  return await axiosInstance.get(
    `/api/v1/open/products/get/product?product-id=${productId}&request-id=1233`
  );
};
