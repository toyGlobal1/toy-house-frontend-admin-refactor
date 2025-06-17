export const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return null;
  }
  return token;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem("accessToken");
};
