import { CUSTOMER_API } from "@/constants/api-endpoints";
import { axiosClient } from "@/lib/axios";
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
  DeleteCustomerResponse,
  CustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  RedeemPointsRequest,
  RedeemPointsResponse,
  EarnPointsRequest,
  EarnPointsResponse,
  PointHistoryResponse,
  PointHistoryQuery,
} from "@/types/customer.type";
import { CustomerQueryParams } from "@/types/customer.type";


export const customerService = {
  getCustomers: async (params: CustomerQueryParams) => {
    const response = await axiosClient.get<CustomerResponse>(
      "/customers/get",
      { params },
    );
    return response.data;
  },
  createCustomer: async (payload: CreateCustomerRequest) => {
    const response = await axiosClient.post<CreateCustomerResponse>(
      "/customers/create",
      payload,
    );
    return response.data;
  },
  deleteCustomer: async (customerId: number) => {
    const response = await axiosClient.delete<DeleteCustomerResponse>(
      `/customers/${customerId}`,
    );
    return response.data;
  },
  updateCustomer: async (customerId: number,payload: UpdateCustomerRequest) => {
    const response = await axiosClient.put<UpdateCustomerResponse>(
      `/customers/${customerId}`,
      payload,
    );
    return response.data;
  },
  earnPoints: async (customerId: number, payload: EarnPointsRequest) => {
    const response = await axiosClient.post<EarnPointsResponse>(
      `/customers/${customerId}/points/earn`,
      payload,
    );
    return response.data;
  },
  redeemPoints: async (customerId: number, payload: RedeemPointsRequest) => {
    const response = await axiosClient.post<RedeemPointsResponse>(
      `/customers/${customerId}/points/redeem`,
      payload,
    );
    return response.data;
  },
  
  getPointHistory: async (customerId: number, params: PointHistoryQuery) => {
    const response = await axiosClient.get<PointHistoryResponse>(
      `/customers/${customerId}/points/history`,
      { params },
    );
    return response.data;
  },
};
