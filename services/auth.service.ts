
import { axiosClient } from "@/lib/axios";

export const authService = {
  login: async (data: { username: string; password: string, deviceId: string }) => {
    const res = await axiosClient.post("/auth/login", data, {
      withCredentials: true,
    });
    return res.data;
  },


  logout: async (refreshToken: string | undefined) => {
    const res = await axiosClient.post("/auth/logout",{ refreshToken },{ withCredentials: true });
    return res.data;
  },
};