import { AUTH_API } from "@/constants/api-endpoints";
import { axiosClient } from "@/lib/axios";

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const res = await axiosClient.post(AUTH_API.LOGIN, data);
    return res.data;
  },

};