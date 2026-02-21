import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/lib/models/Visitor";

export async function DELETE() {
  try {
    await connectDB();
    await Visitor.deleteMany({});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
