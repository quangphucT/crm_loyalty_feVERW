import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import {
  RedeemPointsResponse,
  RedeemPointsVariables,
} from "@/types/customer.type";

export const useRedeemPoints = () => {
  return useMutation<
    RedeemPointsResponse,
    AxiosError<ErrorResponse>,
    RedeemPointsVariables
  >({
    mutationFn: ({ id, payload }) => customerService.redeemPoints(id, payload),
  });
};
