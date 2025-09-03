import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/lib/api/store";

// Configure route as dynamic and specify it cannot be exported statically
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
// Remove static revalidation
// export const revalidate = 300; // 5 minutes

export async function GET(_req: NextRequest) {
  const token = (await cookies()).get(AUTH_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  // Add cache control headers
  const response = NextResponse.json({ token }, { status: 200 });
  response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes
  
  return response;
}
