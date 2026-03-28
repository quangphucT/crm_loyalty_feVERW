import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import { CreateCustomerRequest, CreateCustomerResponse } from "@/types/customer.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateCustomer = () => {
  return useMutation<CreateCustomerResponse, AxiosError<ErrorResponse>, CreateCustomerRequest>({
    mutationFn: (payload: CreateCustomerRequest) =>customerService.createCustomer(payload)
  });
};
