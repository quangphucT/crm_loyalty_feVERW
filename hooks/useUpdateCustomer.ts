import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import {  UpdateCustomerResponse, UpdateCustomerVariables } from "@/types/customer.type";



export const useUpdateCustomer = () => {
  return useMutation<UpdateCustomerResponse, AxiosError<ErrorResponse>, UpdateCustomerVariables>({
    mutationFn: ({ id, payload }) =>
      customerService.updateCustomer(id, payload),
  });
};
