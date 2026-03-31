"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import CustomerManagement from "../customer_management/page";
import { menuItems } from "@/constants/menuItem-dashboard";
import HeaderSideBar from "@/components/dashboard/HeaderSideBar";
import FastNote from "@/components/dashboard/FastNote";
import { panelContent } from "@/constants/panelContent-dashboard";
import { useAuthStore } from "@/store/auth.store";

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState(menuItems[0].id);
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
  const activePanel = panelContent[activeItem];
  const renderNavButton = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return null;
    const Icon = item.icon;
    const isActive = activeItem === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setActiveItem(item.id)}
        className={cn(
          "group flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-medium transition-all md:px-4",
          isActive
            ? "border-sky-200 bg-sky-50/80 text-sky-900 shadow-md shadow-sky-200"
            : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white",
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl border",
            isActive
              ? "border-sky-200 bg-white text-sky-600"
              : "border-slate-200 bg-white text-slate-400",
          )}
        >
          <Icon size={18} />
        </span>
        <span className="whitespace-nowrap">{item.label}</span>
        <span className="ml-auto text-xs text-slate-400 group-hover:text-slate-500">
          {isActive ? "Đang xem" : "Xem"}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f2ea] px-3 py-4 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex min-h-[calc(100vh-48px)] flex-col gap-6 rounded-[32px] border border-slate-100 bg-white/60 p-3 shadow-2xl shadow-slate-200/60 backdrop-blur-lg lg:flex-row lg:gap-8 lg:p-6">
        <aside className="hidden lg:block w-full max-w-xs rounded-[28px] border border-white/80 bg-[#fff8f0] p-4 shadow-inner shadow-slate-200/70 lg:p-6">
          <HeaderSideBar />
          <nav className="mt-6 space-y-2">
            {menuItems.map((item) => renderNavButton(item.id))}
          </nav>
          <FastNote/>
        </aside>

        <section className="flex-1 rounded-[28px] border border-white/60 bg-white/90 p-4 shadow-xl shadow-slate-200/70 sm:p-5 lg:p-8">
          <div className="mb-4 overflow-x-auto lg:hidden">
            <div className="flex gap-2 pr-2">
              {menuItems.map((item) => renderNavButton(item.id))}
            </div>
          </div>

          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            {activePanel.subtitle}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">
              {activePanel.title}
            </h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              {menuItems.find((item) => item.id === activeItem)?.label}
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            {activePanel.description}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-gradient-to-r from-sky-50/70 via-white to-amber-50/70 p-4 shadow-inner shadow-slate-200/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-sky-200/60 blur-lg" aria-hidden />
                  <div className="relative flex size-12 items-center justify-center rounded-full border border-white bg-white text-base font-semibold text-sky-700 shadow-sm">
                    {userInitials}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tài khoản</p>
                  <p className="text-lg font-semibold text-slate-900">{displayUsername}</p>
                  <p className="text-sm text-slate-500">Vai trò: {displayRole}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {isHydrated ? "Phiên đang mở" : "Khôi phục phiên"}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {menuItems.find((item) => item.id === activeItem)?.label}
                </span>
              </div>
            </div>
          </div>

          {activeItem === "customers" && (
             <CustomerManagement/>
          ) }
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
