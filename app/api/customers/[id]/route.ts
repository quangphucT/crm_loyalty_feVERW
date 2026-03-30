import { env } from "@/config/env";
import { CUSTOMER_API } from "@/constants/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// delete
export async function DELETE(
  _req: NextRequest,
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
  const backendResponse = await fetch(
    `${env.API_URL}${CUSTOMER_API.UPDE_CUSTOMER(Number(customerId))}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    },
  );
  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false },
      { status: backendResponse.status },
    );
  }
  const data = await backendResponse.json();
  return NextResponse.json(data);
}


// update 
export async function PUT(
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
  const body = await req.json();
  const backendResponse = await fetch(
    `${env.API_URL}${CUSTOMER_API.UPDE_CUSTOMER(Number(customerId))}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(body),
    },
  );
  if (!backendResponse.ok) {
    return NextResponse.json(
      { success: false },
      { status: backendResponse.status },
    );
  }
  const data = await backendResponse.json();
  return NextResponse.json(data);
}
