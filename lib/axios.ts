import axios from "axios";
import { env } from "@/config/env";

export const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true, 
});
// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: xử lý refresh token tại đây nếu cần
    return Promise.reject(error);
  }
);