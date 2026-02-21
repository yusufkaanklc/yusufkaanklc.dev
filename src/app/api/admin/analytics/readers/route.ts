import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogReader } from "@/lib/models/BlogReader";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get("blogPostId");

    if (blogPostId) {
      if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
        return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 });
      }
      await BlogReader.deleteMany({ blogPostId });
    } else {
      await BlogReader.deleteMany({});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
