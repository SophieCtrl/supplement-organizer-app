import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const token = localStorage.getItem("authtoken");
axiosInstance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
