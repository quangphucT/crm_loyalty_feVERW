import { env } from "@/config/env";
import { CUSTOMER_API } from "@/constants/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
  const payload = await req.json();

  const backendResponse = await fetch(
    `${env.API_URL}${CUSTOMER_API.REDEEM_POINTS(Number(customerId))}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  return NextResponse.json(data);
}
