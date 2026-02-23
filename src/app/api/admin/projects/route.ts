import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/Project";
import { projectSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

const log = logger("api/admin/projects");

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().lean();
    return NextResponse.json(projects);
  } catch (err) {
    log.error("GET failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const project = await Project.create(parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
