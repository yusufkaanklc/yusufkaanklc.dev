import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { BlogReader } from "@/lib/models/BlogReader";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const count = await BlogReader.countDocuments({ blogPostId: post._id });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reader count" }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    await BlogReader.findOneAndUpdate(
      { blogPostId: post._id, ip },
      { blogPostId: post._id, ip, readAt: new Date() },
      { upsert: true }
    );

    const count = await BlogReader.countDocuments({ blogPostId: post._id });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to record reader" }, { status: 500 });
  }
}
