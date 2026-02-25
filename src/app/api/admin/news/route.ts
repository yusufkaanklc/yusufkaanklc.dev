import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NewsArticle } from "@/lib/models/News";
import { newsArticleSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/news");

export async function GET() {
  try {
    await connectDB();
    const news = await NewsArticle.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(news);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = newsArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const article = await NewsArticle.create(parsed.data);
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as Record<string, unknown>).code === 11000) {
      return NextResponse.json({ error: { slug: ["Slug already exists"] } }, { status: 400 });
    }
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
