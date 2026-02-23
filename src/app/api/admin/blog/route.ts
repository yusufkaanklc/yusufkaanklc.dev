import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { blogPostSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/blog");

function calculateReadingTime(content?: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = { ...parsed.data, readingTime: calculateReadingTime(parsed.data.content) };
    const post = await BlogPost.create(data);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as Record<string, unknown>).code === 11000) {
      return NextResponse.json({ error: { slug: ["Slug already exists"] } }, { status: 400 });
    }
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
