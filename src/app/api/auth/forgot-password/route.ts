import { NextResponse } from "next/server";
import { endPoints } from "@/lib/api/endpoints";

// Configure route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const response = await fetch(endPoints.auth.requestPasswordReset, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Return the same status code from the backend
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to request password reset" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
