import { axiosInstance } from "../lib/axios.config";

export const getAllReviews = async () => {
  return await axiosInstance.get(
    "/api/v1/admin/get/reviews?page-number=0&page-size=1000&request-id=1234"
  );
};

export const deleteReview = async (reviewId) => {
  return await axiosInstance.delete(`/api/v1/admin/delete/review/${reviewId}?request-id=1234`);
};
