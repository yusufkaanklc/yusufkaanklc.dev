import { NextResponse } from "next/server";
import { verifyPassword, signToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, retryAfterSeconds } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const valid = await verifyPassword(password, hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await signToken({ role: "admin" });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
