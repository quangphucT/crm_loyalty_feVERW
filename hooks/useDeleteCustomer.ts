import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import { DeleteCustomerResponse } from "@/types/customer.type";

export const useDeleteCustomer = () => {
  return useMutation<DeleteCustomerResponse, AxiosError<ErrorResponse>, number>({
    mutationFn: (customerId: number) => customerService.deleteCustomer(customerId),
  });
};
