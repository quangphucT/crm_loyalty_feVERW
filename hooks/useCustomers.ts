import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CustomerQueryParams, CustomerResponse } from "@/types/customer.type";
import { customerService } from "@/services/customer.service";

export const useCustomers = (params: CustomerQueryParams) => {
  return useQuery<CustomerResponse>({
    queryKey: ["customers", params],
    queryFn: () => customerService.getCustomers(params),
    placeholderData: keepPreviousData,
  });
};
