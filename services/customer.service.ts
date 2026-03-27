import { CUSTOMER_API } from "@/constants/api-endpoints";
import { axiosClient } from "@/lib/axios";
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerResponse,
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
};
