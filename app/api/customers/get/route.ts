import { CUSTOMER_API } from "@/constants/api-endpoints";
import { env } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  //  lấy query params từ FE
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString(); // page=1&size=10...
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
    `${env.API_URL}${CUSTOMER_API.GET_CUSTOMERS}?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, //  đính token
      },
    },
  );

  const data = await backendRes.json();

  //  nếu token hết hạn ở backend
  if (backendRes.status === 401) {
    return NextResponse.json(data, { status: 401 });
  }

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  return NextResponse.json(data);
}
