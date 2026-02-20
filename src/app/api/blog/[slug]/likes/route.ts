import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { BlogLike } from "@/lib/models/BlogLike";
import { getClientIp } from "@/lib/get-client-ip";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const headersList = await headers();
    const ip = getClientIp(headersList);

    const [count, existing] = await Promise.all([
      BlogLike.countDocuments({ blogPostId: post._id }),
      BlogLike.findOne({ blogPostId: post._id, ip }),
    ]);

    return NextResponse.json({ count, liked: !!existing });
  } catch {
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const headersList = await headers();
    const ip = getClientIp(headersList);

    const existing = await BlogLike.findOne({ blogPostId: post._id, ip });

    if (existing) {
      await BlogLike.deleteOne({ _id: existing._id });
    } else {
      await BlogLike.create({ blogPostId: post._id, ip, likedAt: new Date() });
    }

    const count = await BlogLike.countDocuments({ blogPostId: post._id });
    return NextResponse.json({ count, liked: !existing });
  } catch {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
