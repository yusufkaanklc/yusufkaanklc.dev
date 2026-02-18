import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { blogPostSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  const posts = await BlogPost.find().lean();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const post = await BlogPost.create(parsed.data);
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
