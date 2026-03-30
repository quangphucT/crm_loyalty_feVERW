import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard_layout");

  if (!accessToken && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard_layout", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard_layout/:path*", "/login"],
};