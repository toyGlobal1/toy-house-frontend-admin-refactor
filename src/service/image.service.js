import axios from "axios";

export const uploadImageToIMG_BB = async (formData) => {
  const apiKey = import.meta.env.VITE_IMG_BB_API_KEY;

  const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
