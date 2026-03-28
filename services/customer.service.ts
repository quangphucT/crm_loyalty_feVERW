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
      CUSTOMER_API.GET_CUSTOMERS,
      { params },
    );
    return response.data;
  },
  createCustomer: async (payload: CreateCustomerRequest) => {
    const response = await axiosClient.post<CreateCustomerResponse>(
      CUSTOMER_API.CREATE_CUSTOMER,
      payload,
    );
    return response.data;
  },
  updateCustomer: async (customerId: number,payload: UpdateCustomerRequest) => {
    const response = await axiosClient.put<UpdateCustomerResponse>(
      CUSTOMER_API.UPDE_CUSTOMER(customerId),
      payload,
    );
    return response.data;
  },
  deleteCustomer: async (customerId: number) => {
    const response = await axiosClient.delete<DeleteCustomerResponse>(
      CUSTOMER_API.UPDE_CUSTOMER(customerId),
    );
    return response.data;
  },
  redeemPoints: async (customerId: number, payload: RedeemPointsRequest) => {
    const response = await axiosClient.post<RedeemPointsResponse>(
      CUSTOMER_API.REDEEM_POINTS(customerId),
      payload,
    );
    return response.data;
  },
  earnPoints: async (customerId: number, payload: EarnPointsRequest) => {
    const response = await axiosClient.post<EarnPointsResponse>(
      CUSTOMER_API.EARN_POINTS(customerId),
      payload,
    );
    return response.data;
  },
  getPointHistory: async (customerId: number, params: PointHistoryQuery) => {
    const response = await axiosClient.get<PointHistoryResponse>(
      CUSTOMER_API.POINT_HISTORY(customerId),
      { params },
    );
    return response.data;
  },
};
