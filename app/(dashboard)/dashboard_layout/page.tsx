"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomerManagement from "../customer_management/page";
import { menuItems } from "@/constants/menuItem-dashboard";
import HeaderSideBar from "@/components/dashboard/HeaderSideBar";
import FastNote from "@/components/dashboard/FastNote";
import { panelContent } from "@/constants/panelContent-dashboard";

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState(menuItems[0].id);
  const activePanel = panelContent[activeItem];
  return (
    <div className="min-h-screen bg-[#f7f2ea] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex min-h-[calc(100vh-48px)] flex-col gap-8 rounded-[32px] border border-slate-100 bg-white/60 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur-lg lg:flex-row lg:p-6">
        <aside className="w-full max-w-xs rounded-[28px] border border-white/80 bg-[#fff8f0] p-4 shadow-inner shadow-slate-200/70 lg:p-6">
          <HeaderSideBar />
          <nav className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item.id)}
                  className={cn(
                    "group flex cursor-pointer w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all",
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
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs text-slate-400 group-hover:text-slate-500">
                    {isActive ? "Đang xem" : "Xem"}
                  </span>
                </button>
              );
            })}
          </nav>
          <FastNote/>
        </aside>

        <section className="flex-1  rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70 lg:p-8">
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

          {activeItem === "customers" && (
             <CustomerManagement/>
          ) }
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
