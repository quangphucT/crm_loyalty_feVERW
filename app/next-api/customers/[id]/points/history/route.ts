import { env } from "@/config/env";
import { CUSTOMER_API } from "@/constants/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id: customerId } = await params;
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();

  const backendResponse = await fetch(
    `${env.API_URL}${CUSTOMER_API.POINT_HISTORY(Number(customerId))}?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  return NextResponse.json(data);
}
