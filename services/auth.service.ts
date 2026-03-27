import { axiosClient } from "@/lib/axios";

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get("/auth/me");
    return res.data;
  },
};