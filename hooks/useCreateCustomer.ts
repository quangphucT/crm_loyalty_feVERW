import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import { CreateCustomerRequest, CreateCustomerResponse } from "@/types/customer.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify/unstyled";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCustomerResponse, AxiosError<ErrorResponse>, CreateCustomerRequest>({
    mutationFn: (payload: CreateCustomerRequest) =>customerService.createCustomer(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Tạo khách hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
