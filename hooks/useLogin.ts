import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ErrorResponse, LoginPayload, SignInResponse } from "@/types/auth.type";
import { AxiosError } from "axios";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  return useMutation<SignInResponse, AxiosError<ErrorResponse>, LoginPayload>({
    mutationKey: ["login"],
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Sign in failed. Please try again.",
      );
    },
    onSuccess: (data) => {
      setAuth({
        username: data.data.username,
        role: data.data.role,
      });
      router.push("/dashboard_layout");
      toast.success("Đăng nhập thành công!");
    },
  });
};
