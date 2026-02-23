import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { logger } from "@/lib/logger";

const log = logger("proxy");

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  const isApiRoute = request.nextUrl.pathname.startsWith("/api/admin");

  if (!token) {
    log.warn(`no token — blocked ${request.method} ${request.nextUrl.pathname}`);
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    log.warn(`invalid token — blocked ${request.method} ${request.nextUrl.pathname}`);
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
