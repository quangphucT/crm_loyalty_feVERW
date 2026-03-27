import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/common/ReactQueryProvider";
import { ToastContainer } from "react-toastify";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CRM Loyalty",
  description:
    "Hệ thống quản lý khách hàng và điểm thưởng loyalty dành cho admin & staff: tạo hồ sơ khách hàng, cộng/trừ điểm, theo dõi lịch sử và quản lý đổi quà.",
  icons: {
    icon: "/icons/WebLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {" "}
        <ReactQueryProvider>{children}</ReactQueryProvider> <ToastContainer />
      </body>
    </html>
  );
}
