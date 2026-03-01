import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/fetchers";
import { logger } from "@/lib/logger";

const log = logger("api/blog");

export async function GET(req: NextRequest) {
  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const result = await getPostsPaginated(page);
    return NextResponse.json(result);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ items: [], page: 1, hasMore: false });
  }
}
