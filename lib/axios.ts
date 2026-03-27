import axios from "axios";
import { env } from "@/config/env";

export const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  // Cookie sẽ tự gửi lên server, không cần Authorization header
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);