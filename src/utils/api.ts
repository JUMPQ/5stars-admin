// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.5starsteams.com/api",
});

api.interceptors.request.use((config) => {
  // Use localStorage directly in the browser
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data, error.response?.status);

    if (error.response?.status === 401 && typeof window !== "undefined") {
      +localStorage.removeItem("token");
      // Clear invalid token

      // Optional: Redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
