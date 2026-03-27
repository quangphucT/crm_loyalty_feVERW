import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
  });
};