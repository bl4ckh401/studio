import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { endPoints } from "@/lib/api/endpoints";
import { AUTH_TOKEN } from "@/lib/api/store";

// Configure route as dynamic and specify it cannot be exported statically
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const response = await fetch(`${endPoints.auth.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    if (!responseData.data?.token || !responseData.data?.user) {
      return NextResponse.json(
        { message: "Invalid response from server" },
        { status: 500 }
      );
    }

    const token = responseData.data.token;

    // Create cookie
    const cookie = serialize(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return both user and token in response
    return new Response(
      JSON.stringify({
        user: responseData.data.user,
        token: token,
        message: "Logged in successfully"
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
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
