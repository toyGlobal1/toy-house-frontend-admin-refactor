import { axiosInstance } from "../lib/axios.config";

export const getAllProducts = async () => {
  return await axiosInstance.get(
    "/api/v1/open/products/get/products/for-dashboard?page-number=0&page-size=1000&request-id=1212"
  );
};

export const deleteProduct = async (productId) => {
  return await axiosInstance.delete(`/api/v1/open/products/delete/${productId}?request-id=1234`);
};

export const changeProductStatus = async (data) => {
  return await axiosInstance.put(
    `/api/v1/open/products/change/availability/status?request-id=1234`,
    data
  );
};

export const setFeaturedProduct = async (data) => {
  return await axiosInstance.put(
    `/api/v1/open/products/set/featured-product?request-id=1234`,
    data
  );
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

export const deleteProductInventory = async (inventoryId) => {
  return await axiosInstance.delete(
    `/api/v1/admin/product/inventory/delete/${inventoryId}?request-id=1234`
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

export const getProductCategories = async () => {
  return await axiosInstance.get(
    "api/v1/open/categories/get/all?page=0&size=1000&request-id=12341234"
  );
};

export const getProductBrands = async () => {
  return await axiosInstance.get("api/v1/open/brands/get/all?page=0&size=1000&request-id=12341234");
};

export const getProductMaterials = async () => {
  return await axiosInstance.get(
    "/api/v1/admin/materials/get?page-number=0&page-size=1000&request-id=1234"
  );
};

export const addProduct = async (data) => {
  return await axiosInstance.post("/api/v1/open/products/add/product?request-id=1234", data);
};

export const updateProduct = async (data) => {
  return await axiosInstance.put("/api/v1/open/products/update?request-id=1234", data);
};
