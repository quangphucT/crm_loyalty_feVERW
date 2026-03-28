
export const AUTH_API = {
  LOGIN: "/auth/login"
};

export const CUSTOMER_API = {
  GET_CUSTOMERS: "/customers",
  CREATE_CUSTOMER: "/customers",
  UPDE_CUSTOMER: (id: number) => `/customers/${id}`,
  REDEEM_POINTS: (id: number) => `/customers/${id}/points/redeem`,
  EARN_POINTS: (id: number) => `/customers/${id}/points/earn`,
  POINT_HISTORY: (id: number) => `/customers/${id}/points/history`,
};