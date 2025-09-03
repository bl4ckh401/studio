import { NextResponse } from "next/server";
import { endPoints } from "@/lib/api/endpoints";
import { AUTH_TOKEN } from "@/lib/api/store";
import { cookies } from "next/headers";
import { serialize } from "cookie";

// Configure route as dynamic and specify it cannot be exported statically
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const response = await fetch(endPoints.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Registration failed" },
        { status: response.status }
      );
    }

    const token = responseData.data?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Invalid response from server" },
        { status: 500 }
      );
    }

    // Create cookie
    const cookie = serialize(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(
      JSON.stringify({
        user: responseData.data?.user,
        token: token,
        message: "Account created successfully"
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}