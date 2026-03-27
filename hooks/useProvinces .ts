import { provinceService } from "@/services/province.service";
import { useQuery } from "@tanstack/react-query";

type UseProvincesOptions = {
  enabled?: boolean;
};

export const useProvinces = (options?: UseProvincesOptions) => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: provinceService.getAll,
    staleTime: 1000 * 60 * 60 * 24, // cache 1 ngày
    enabled: options?.enabled ?? true,
  });
};