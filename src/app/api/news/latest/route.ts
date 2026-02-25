import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NewsArticle } from "@/lib/models/News";
import { logger } from "@/lib/logger";

const log = logger("api/news/latest");

export async function GET() {
  try {
    await connectDB();
    const article = await NewsArticle.findOne({ published: true })
      .sort({ createdAt: -1 })
      .select("_id title slug summary tags date")
      .lean();
    return NextResponse.json(article ?? null);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json(null);
  }
}
