import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/lib/models/Visitor";
import { getClientIp } from "@/lib/get-client-ip";

export async function GET() {
  try {
    await connectDB();
    const count = await Visitor.countDocuments();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to fetch visitor count" }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();

    const headersList = await headers();
    const ip = getClientIp(headersList);

    await Visitor.findOneAndUpdate(
      { ip },
      { ip, visitedAt: new Date() },
      { upsert: true }
    );

    const count = await Visitor.countDocuments();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to record visitor" }, { status: 500 });
  }
}
