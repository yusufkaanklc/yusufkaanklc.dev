import { NextRequest, NextResponse } from "next/server";
import { getOpenApiDocument } from "@/lib/openapi/document";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("swagger-token")?.value;
  if (token !== process.env.SWAGGER_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = getOpenApiDocument();
  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
