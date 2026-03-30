import axios from "axios";
import { AUTH_API } from "@/constants/api-endpoints";

export const authService = {
  login: async (data: { username: string; password: string }) => {
    const res = await axios.post(`/api${AUTH_API.LOGIN}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

};