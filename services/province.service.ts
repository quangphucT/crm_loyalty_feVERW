
import axios from "axios";
const PROVINCE_API_URL = process.env.NEXT_PUBLIC_PROVINCE_API_URL;
if (!PROVINCE_API_URL) {
  throw new Error("Missing env: NEXT_PUBLIC_PROVINCE_API_URL");
}
export const provinceService = {
  getAll: async () => {
    const res = await axios.get(`${PROVINCE_API_URL}/p/`);
    return res.data;
  },
};