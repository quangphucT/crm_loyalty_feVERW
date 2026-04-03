import { AUTH_API } from "@/constants/api-endpoints";
import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const backendRes = await fetch(`${env.API_URL}${AUTH_API.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }
  //  tạo response trước
  const res = NextResponse.json(data);
  
  //  set cookie tại đây
  res.cookies.set("accessToken", data.data.accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60,
  });

  res.cookies.set("refreshToken", data.data.refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60*5, 
  });

  return res;
}