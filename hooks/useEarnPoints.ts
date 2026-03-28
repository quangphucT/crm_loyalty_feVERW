import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { customerService } from "@/services/customer.service";
import { ErrorResponse } from "@/types/auth.type";
import {
  EarnPointsResponse,
  EarnPointsVariables,
} from "@/types/customer.type";

export const useEarnPoints = () => {
  return useMutation<
    EarnPointsResponse,
    AxiosError<ErrorResponse>,
    EarnPointsVariables
  >({
    mutationFn: ({ id, payload }) => customerService.earnPoints(id, payload),
  });
};
