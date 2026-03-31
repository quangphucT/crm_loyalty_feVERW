"use client";

import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/auth.store";
import { useMemo } from "react";

const HeaderSideBar = () => {
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const userInitials = useMemo(() => {
    const name = user?.username?.trim();
    if (!name) return "??";
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
    const letters = `${first}${second}`.toUpperCase();
    return letters || "??";
  }, [user?.username]);

  const displayUsername = isHydrated ? user?.username ?? "Ẩn danh" : "Đang tải...";
  const displayRole = isHydrated ? user?.role ?? "Chưa có vai trò" : "Đang tải...";

  return (
    <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-5 text-center space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Loyalty Hub
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-800">
          Bảng điều khiển
        </h2>
        <p className="text-xs text-slate-500">Tổng quan vận hành khách hàng</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-sky-50/80 via-white to-amber-50/70 p-4 text-left shadow-inner shadow-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-sky-200/50 blur-md" aria-hidden />
            <div className="relative flex size-10 items-center justify-center rounded-full border border-white bg-white text-sm font-semibold text-sky-700 shadow-sm">
              {userInitials}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tài khoản</p>
            <p className="truncate text-base font-semibold text-slate-900">{displayUsername}</p>
            <p className="text-xs text-slate-500">Vai trò: {displayRole}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {isHydrated ? "Phiên đang mở" : "Khôi phục phiên"}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
            Dashboard
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        disabled={isPending}
        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 active:translate-y-0.5 active:shadow disabled:opacity-60"
      >
        {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
    </div>
  );
};

export default HeaderSideBar;
