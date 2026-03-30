import { CUSTOMER_API } from "@/constants/api-endpoints";
import { env } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json(
      {
        status: 401,
        error: "Token expired",
        message: "Access token expired",
      },
      { status: 401 },
    );
  }
  //  gọi backend thật
  const backendRes = await fetch(
    `${env.API_URL}${CUSTOMER_API.CREATE_CUSTOMER}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    console.log("Status:", backendRes.status);
    return NextResponse.json(data, { status: backendRes.status });
  }

  return NextResponse.json(data);
}
