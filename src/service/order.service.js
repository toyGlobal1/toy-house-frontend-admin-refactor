import { axiosInstance } from "../lib/axios.config";

export const getAllOrders = async () => {
  return await axiosInstance.get("/api/v1/admin/order/get/all?page=0&size=1000&request-id=1234");
};
