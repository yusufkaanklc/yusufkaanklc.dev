import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";

export async function GET() {
  await connectDB();
  const posts = await BlogPost.find().lean();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const post = await BlogPost.create(body);
  return NextResponse.json(post, { status: 201 });
}
