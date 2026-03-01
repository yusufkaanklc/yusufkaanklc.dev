import { NextRequest, NextResponse } from "next/server";
import { getNewsPaginated } from "@/lib/fetchers";
import { logger } from "@/lib/logger";

const log = logger("api/news");

export async function GET(req: NextRequest) {
  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const result = await getNewsPaginated(page);
    return NextResponse.json(result);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ items: [], page: 1, hasMore: false });
  }
}
