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

export const getProductColors = async () => {
  return await axiosInstance.get(
    "/api/v1/admin/colors/get?page-number=0&page-size=10&request-id=1234"
  );
};

export const addProductInventory = async (data) => {
  return await axiosInstance.post(
    `/api/v1/admin/product/inventory/upload/inventory?request-id=1234`,
    data
  );
};

export const updateProductInventory = async (data) => {
  return await axiosInstance.put(
    `/api/v1/admin/product/inventory/update/inventory?request-id=1234`,
    data
  );
};

/* Product Inventory Image */
export const getProductInventoryImages = async (inventoryId) => {
  return await axiosInstance.get(
    `/api/v1/admin/product/inventory/get/images?product-inventory-id=${inventoryId}&request-id=1234`
  );
};

export const addProductInventoryImage = async (data) => {
  return await axiosInstance.post(
    `/api/v1/admin/product/inventory/add/images?request-id=1234`,
    data
  );
};

export const setProductInventoryDisplayImage = async (imageId) => {
  return await axiosInstance.put(
    `/api/v1/admin/product/inventory/set/display/image?image-id=${imageId}&request-id=1234`
  );
};

export const deleteProductInventoryImage = async (imageId) => {
  return await axiosInstance.delete(
    `/api/v1/admin/product/inventory/delete/image?image-id=${imageId}&request-id=1234`
  );
};
