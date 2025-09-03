import { NextResponse } from "next/server";
import { endPoints } from "@/lib/api/endpoints";

// Configure route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "Email, token and password are required" },
        { status: 400 }
      );
    }

    const response = await fetch(endPoints.auth.resetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, token, password }),
    });

    const data = await response.json();

    // Return the same status code from the backend
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to reset password" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
