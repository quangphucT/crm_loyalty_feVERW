import { AUTH_API } from "@/constants/api-endpoints";
import { env } from "@/config/env";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    let backendRes: Response;
    try {
      backendRes = await fetch(`${env.API_URL}${AUTH_API.REFRESH_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      });
    } catch (err) {
      return NextResponse.json(
        { message: "Cannot reach auth service" },
        { status: 500 },
      );
    }
    let data;
    let rawBody: string | undefined;
    try {
      data = await backendRes.json();
    } catch {
      rawBody = await backendRes.text();
      data = null;
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        data ?? { message: "Refresh backend error", raw: rawBody },
        { status: backendRes.status },
      );
    }

    const payloadAccessToken = data?.data?.accessToken ?? data?.accessToken;

    const res = NextResponse.json(data);
    res.cookies.set("accessToken", payloadAccessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60,
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
