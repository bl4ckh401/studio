import { NextResponse } from "next/server";
import { endPoints } from "@/lib/api/endpoints";
import { AUTH_TOKEN } from "@/lib/api/store";
import { serialize } from "cookie";

// Configure route as dynamic and specify it cannot be exported statically
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Get verification code and email from request
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Call backend API to verify the code
    const response = await fetch(endPoints.auth.activateAccount, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: code }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Verification failed" },
        { status: response.status }
      );
    }    // If verification was successful, the backend might return a token
    const token = responseData.data?.token;
    
    // Always mark the user as verified
    const userData = responseData.data?.user || {};
    
    // Ensure the user is marked as verified
    const verifiedUser = {
      ...userData,
      isVerified: true
    };

    if (token) {
      // Create cookie
      const cookie = serialize(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Return the response with cookie
      return new Response(
        JSON.stringify({
          verified: true,
          user: verifiedUser,
          message: "Email verification successful"
        }),
        {
          status: 200,
          headers: {
            "Set-Cookie": cookie,
            "Content-Type": "application/json",
          },
        }
      );
    }    // If no token was returned, just return success response with user
    return NextResponse.json(
      { 
        verified: true,
        user: verifiedUser,
        message: "Email verification successful" 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Get email from URL
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { message: "Email and token are required" },
        { status: 400 }
      );
    }

    // Call backend API to verify the token
    const response = await fetch(`${endPoints.auth.activateAccount}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Verification failed" },
        { status: response.status }
      );
    }
    
    // Extract user data if available
    const userData = responseData.data?.user || {};
    
    // Ensure the user is marked as verified
    const verifiedUser = {
      ...userData,
      isVerified: true
    };

    return NextResponse.json(
      { 
        verified: true,
        user: verifiedUser,
        message: "Email verification successful" 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Get email from request to resend verification code
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Call backend API to resend verification code
    const response = await fetch(endPoints.auth.sendActivationEmail, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || "Failed to resend verification code" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Verification code resent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
