import { provinceService } from "@/services/province.service";
import { useQuery } from "@tanstack/react-query";

type UseProvincesOptions = {
  enabled?: boolean;
  context?: "create" | "edit" | "filter";
};

export const useProvinces = (options?: UseProvincesOptions) => {
  const contextId = options?.context || "default";
  
  return useQuery({
    queryKey: ["provinces", contextId],
    queryFn: provinceService.getAll,
    staleTime: 1000 * 60 * 60 * 24, // cache 1 ngày
    enabled: options?.enabled ?? true,
  });
};