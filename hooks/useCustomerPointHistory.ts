import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { customerService } from "@/services/customer.service";
import { PointHistoryQuery, PointHistoryResponse } from "@/types/customer.type";

interface Params extends PointHistoryQuery {
  customerId?: number;
  enabled?: boolean;
}

export const useCustomerPointHistory = ({
  customerId,
  page = 0,
  size = 10,
  enabled = false,
}: Params) => {
  return useQuery<PointHistoryResponse>({
    queryKey: ["customer-point-history", customerId, page, size],
    queryFn: () =>
      customerId != null
        ? customerService.getPointHistory(customerId, { page, size })
        : Promise.reject(new Error("customerId is required")),
    enabled: enabled && customerId != null,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
};
