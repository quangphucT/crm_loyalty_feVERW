"use client";

import { useLogout } from "@/hooks/useLogout";

const HeaderSideBar = () => {
  const { mutate: logout, isPending } = useLogout();

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
