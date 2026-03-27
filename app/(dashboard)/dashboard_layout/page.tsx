"use client";

import { useState } from "react";
import { MessageSquare, Star, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomerManagement from "../customer_management/page";

const menuItems = [
  { id: "customers", label: "Khách hàng", icon: Users },
  { id: "vip", label: "Hồ sơ VIP", icon: Star },
  { id: "campaigns", label: "Chiến dịch", icon: Target },
  { id: "feedback", label: "Phản hồi & CSKH", icon: MessageSquare },
];

type PanelContent = {
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string; trend: string }[];
  highlights: string[];
};



const panelContent: Record<string, PanelContent> = {
  customers: {
    title: "Quản lý khách hàng",
    subtitle: "Quản lý khách hàng & điểm tích luỹ",
    description:
      "Danh sách khách hàng và thông tin điểm tích lũy để quản lý nhanh chóng.",
    stats: [
      { label: "Khách hoạt động", value: "12.480", trend: "+8% MoM" },
      { label: "Điểm trung bình", value: "1.240", trend: "Ổn định" },
      { label: "Phiếu hỗ trợ", value: "86", trend: "-12% tuần" },
      { label: "Khách sắp hết điểm", value: "312", trend: "Cần nhắc" },
    ],
    highlights: [
      "Ưu tiên nhắc điểm cho nhóm Bronze trước 31/3",
      "Theo dõi chiến dịch onboarding khách mới tuần này",
      "Xem lại danh sách khách ngưng hoạt động trên 90 ngày",
    ],
  },
  vip: {
    title: "Hồ sơ VIP",
    subtitle: "Cá nhân hóa trải nghiệm cho nhóm Loyalist",
    description:
      "Giữ liên hệ nhóm VIP với ưu đãi riêng, ghi nhận lịch sử điểm và quà tặng để bảo toàn giá trị vòng đời.",
    stats: [
      { label: "Khách VIP", value: "420", trend: "+12 thành viên" },
      { label: "Giá trị trung bình", value: "18.2M", trend: "+5% quý" },
      { label: "Yêu cầu ưu tiên", value: "14", trend: "2 mới" },
      { label: "Sự kiện riêng", value: "03", trend: "Đang chuẩn bị" },
    ],
    highlights: [
      "Hoàn tất lịch trình tri ân Q2",
      "Theo dõi các khoản điểm bonus vượt hạn mức",
      "Đảm bảo mỗi VIP có CSKH phụ trách rõ ràng",
    ],
  },
  campaigns: {
    title: "Chiến dịch loyalty",
    subtitle: "Đo lường hiệu quả các chương trình đang chạy",
    description:
      "Theo dõi KPI đổi quà, tỷ lệ tham gia và chi phí điểm để tối ưu chiến dịch trong thời gian thực.",
    stats: [
      { label: "Chiến dịch mở", value: "12", trend: "3 sắp kết thúc" },
      { label: "Tỷ lệ tham gia", value: "48%", trend: "+6%" },
      { label: "Điểm đã dùng", value: "2.3M", trend: "45% ngân sách" },
      { label: "Voucher đã đổi", value: "6.820", trend: "+320 tuần" },
    ],
    highlights: [
      "Tối ưu push notification cho chiến dịch Flash Bonus",
      "Rà soát tồn kho quà tặng hot để tránh hết hàng",
      "A/B testing thông điệp upsell cho phân khúc Silver",
    ],
  },
  feedback: {
    title: "Phản hồi & CSKH",
    subtitle: "Khép kín vòng lặp chăm sóc khách hàng",
    description:
      "Kết hợp ticket CSKH, phản hồi đa kênh và chỉ số hài lòng để ưu tiên xử lý và cải thiện trải nghiệm.",
    stats: [
      { label: "Điểm CSAT", value: "4.7 / 5", trend: "+0.2" },
      { label: "Ticket mở", value: "58", trend: "18 ưu tiên" },
      { label: "Thời gian phản hồi", value: "12m", trend: "Nhanh hơn 5m" },
      { label: "Kênh xã hội", value: "92 mention", trend: "Giảm 9%" },
    ],
    highlights: [
      "Thiết lập macro phản hồi trên Zalo OA",
      "Đào tạo lại quy trình xử lý khiếu nại đổi điểm",
      "Gửi survey sau dịch vụ cho nhóm Khách Mới",
    ],
  },
};

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState(menuItems[0].id);
  const activePanel = panelContent[activeItem];

  return (
    <div className="min-h-screen bg-[#f7f2ea] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="flex min-h-[calc(100vh-48px)] flex-col gap-8 rounded-[32px] border border-slate-100 bg-white/60 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur-lg lg:flex-row lg:p-6">
        <aside className="w-full max-w-xs rounded-[28px] border border-white/80 bg-[#fff8f0] p-4 shadow-inner shadow-slate-200/70 lg:p-6">
          <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-5 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Loyalty Hub
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              Bảng điều khiển
            </h2>
            <p className="text-xs text-slate-500">
              Tổng quan vận hành khách hàng
            </p>
          </div>

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

          <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">Ghi chú nhanh</p>
            <p className="mt-2 text-slate-500">
              Mọi thao tác cộng/trừ điểm đều được ghi nhận lịch sử. Vui lòng
              nhập đúng lý do để đảm bảo minh bạch và dễ đối soát.
            </p>
          </div>
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
