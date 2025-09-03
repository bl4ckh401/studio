import { NextResponse } from "next/server";
import { endPoints } from "@/lib/api/endpoints";
import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/lib/api/store";

// Configure route as dynamic and specify it cannot be exported statically
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
// Remove static revalidation
// export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN)?.value;
    
    // More detailed logging for debugging
    // console.log("API route /api/auth/me - Token exists:", !!token);
    
    if (!token) {
      console.warn("API route /api/auth/me - No token found in cookies");
      return NextResponse.json(
        { message: "Unauthorized", error: "No authentication token" },
        { status: 401 }
      );
    }

    // Add additional headers and error handling for the backend request
    const response = await fetch(endPoints.auth.me, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
    });

    const responseData = await response.json();
    
    // console.log("API route /api/auth/me - Backend response status:", response.status);
    
    if (!response.ok) {
      console.error("API route /api/auth/me - Backend error:", responseData);
      return NextResponse.json(
        { 
          message: responseData.message || "Unauthorized", 
          error: "Backend authentication failed"
        },
        { status: response.status }
      );
    }

    // Normalize the user data structure - handle different API response formats
    const userData = responseData.data?.user || responseData.user || responseData.data;
    
    if (!userData) {
      console.warn("API route /api/auth/me - No user data in response:", responseData);
      return NextResponse.json(
        { message: "Invalid user data", error: "User data missing in response" },
        { status: 500 }
      );
    }
    
    // Add cache control headers to the response
    const apiResponse = NextResponse.json({ 
      user: userData,
      message: "User fetched successfully" 
    }, { status: 200 });
    
    apiResponse.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes
    
    return apiResponse;
  } catch (error: any) {
    console.error("API route /api/auth/me - Error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Internal server error",
        error: "API route exception"
      },
      { status: 500 }
    );
  }
}
