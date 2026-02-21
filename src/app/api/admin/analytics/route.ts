import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/lib/models/Visitor";
import { BlogReader } from "@/lib/models/BlogReader";
import { BlogPost } from "@/lib/models/BlogPost";

export async function GET() {
  try {
    await connectDB();

    const [visitors, blogPosts] = await Promise.all([
      Visitor.find().sort({ visitedAt: -1 }).lean(),
      BlogPost.find().select("title slug").lean(),
    ]);

    const blogReaderData = await Promise.all(
      blogPosts.map(async (post) => {
        const readers = await BlogReader.find({ blogPostId: post._id })
          .sort({ readAt: -1 })
          .lean();
        return {
          blogPostId: post._id,
          title: post.title,
          slug: post.slug,
          readerCount: readers.length,
          readers,
        };
      })
    );

    return NextResponse.json({
      visitors,
      visitorCount: visitors.length,
      blogReaders: blogReaderData,
      totalReaderCount: blogReaderData.reduce((sum, b) => sum + b.readerCount, 0),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
