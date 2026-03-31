"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginFeatureCards } from "@/constants/login-features";
import LoginSection from "@/components/auth/LoginSection";
import LoginHeader from "@/components/auth/LoginHeader";
import { v4 as uuidv4 } from "uuid";
const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tài khoản."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const deviceId = uuidv4();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();
  const isLoading = isPending;
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    login({ ...values, deviceId });
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(248,113,113,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22140%22%20height%3D%22140%22%20viewBox%3D%220%200%20140%20140%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2070h140M70%200v140%22%20fill%3D%22none%22%20stroke%3D%22rgba(148,163,184,0.08)%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <LoginSection />
        <section
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur animate-login-right"
          style={{ animationDelay: "120ms" }}
        >
          <LoginHeader />
          <Form {...form}>
            <form
              className="mt-8 space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Tài khoản
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: admin/staff"
                        disabled={isLoading}
                        className="text-white h-[40px] placeholder:text-slate-400 focus-visible:border-cyan-400 focus-visible:ring-cyan-500/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                          className="text-white h-[40px] placeholder:text-slate-400 focus-visible:border-cyan-400 focus-visible:ring-cyan-500/40"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-white"
                          aria-label={
                            showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p
                  className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-[40px] cursor-pointer bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 flex items-center justify-center gap-2"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </Form>

          <div className="mt-10 grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-5">
            {loginFeatureCards.map((feature) => (
              <div key={feature.title} className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {feature.title}
                </p>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
