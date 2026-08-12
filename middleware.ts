import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("htg_session")?.value;
  const login = new URL("/login", req.url); login.searchParams.set("next", req.nextUrl.pathname);
  if (!token) return NextResponse.redirect(login);
  try {
    const secret = process.env.AUTH_SECRET; if (!secret) throw new Error();
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  } catch { const res = NextResponse.redirect(login); res.cookies.delete("htg_session"); return res; }
}
export const config = { matcher: ["/admin/:path*", "/my-courses/:path*", "/account/:path*", "/checkout/:path*", "/learn/:path*", "/exam/:path*"] };
