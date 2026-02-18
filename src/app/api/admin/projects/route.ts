import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/Project";

export async function GET() {
  await connectDB();
  const projects = await Project.find().lean();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const project = await Project.create(body);
  return NextResponse.json(project, { status: 201 });
}
