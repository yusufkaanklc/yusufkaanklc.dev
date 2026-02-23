import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { BlogLike } from "@/lib/models/BlogLike";
import { getClientIp } from "@/lib/get-client-ip";
import { getVisitorToken, generateVisitorToken, setVisitorTokenCookie } from "@/lib/visitor-token";
import { logger } from "@/lib/logger";

const log = logger("api/blog/likes");

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const token = await getVisitorToken();

    const [count, existing] = await Promise.all([
      BlogLike.countDocuments({ blogPostId: post._id }),
      token ? BlogLike.findOne({ blogPostId: post._id, token }) : null,
    ]);

    return NextResponse.json({ count, liked: !!existing });
  } catch (err) {
    log.error("GET failed", err);
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

    let token = await getVisitorToken();
    let needsCookie = false;

    if (!token) {
      token = generateVisitorToken();
      needsCookie = true;
    }

    const existing = await BlogLike.findOne({ blogPostId: post._id, token });

    if (existing) {
      await BlogLike.deleteOne({ _id: existing._id });
    } else {
      await BlogLike.create({ blogPostId: post._id, token, ip, likedAt: new Date() });
    }

    const count = await BlogLike.countDocuments({ blogPostId: post._id });
    const response = NextResponse.json({ count, liked: !existing });

    if (needsCookie) {
      setVisitorTokenCookie(response, token);
    }

    return response;
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
