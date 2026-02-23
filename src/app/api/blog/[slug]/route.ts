import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { logger } from "@/lib/logger";

const log = logger("api/blog");

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
