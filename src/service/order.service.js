import { axiosInstance } from "../lib/axios.config";

export const getAllOrders = async () => {
  return await axiosInstance.get("/api/v1/admin/order/get/all?page=0&size=1000&request-id=1234");
};

export const updateOrderStatus = async ({ orderId, status }) => {
  return await axiosInstance.put(
    `/api/v1/admin/order/update/${orderId}?order-status=${status}&request-id=1234`
  );
};
