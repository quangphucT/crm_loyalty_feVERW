export default function LoginSection() {
  return (
    <section className="max-w-2xl space-y-10 text-gray-200 animate-login-left">
      <div className="inline-flex items-center rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">
        CRM Loyalty Portal
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
          Theo dõi khách hàng, kiểm soát điểm thưởng và xử lý đổi quà.
        </h1>

        <p className="text-base text-slate-300 md:text-lg">
          Tập trung quản lý dữ liệu khách hàng, kiểm soát điểm thưởng và lưu vết
          mọi thay đổi. Đảm bảo vận hành loyalty an toàn, minh bạch và đúng quy
          trình nội bộ.
        </p>
      </div>
    </section>
  );
}