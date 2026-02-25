import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NewsArticle } from "@/lib/models/News";
import { newsArticleSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

const log = logger("api/admin/news/[id]");

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await request.json();
    const parsed = newsArticleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const article = await NewsArticle.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as Record<string, unknown>).code === 11000) {
      return NextResponse.json({ error: { slug: ["Slug already exists"] } }, { status: 400 });
    }
    log.error("PUT failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const article = await NewsArticle.findByIdAndDelete(id);
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("DELETE failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
