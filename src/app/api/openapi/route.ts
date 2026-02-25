import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/lib/openapi/document";

export async function GET() {
  const doc = getOpenApiDocument();
  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
