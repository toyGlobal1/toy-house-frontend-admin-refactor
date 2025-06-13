import { axiosInstance } from "../lib/axios.config";

export const login = async (data) => {
  return await axiosInstance.post("/api/v1/open/users/login", data);
};
