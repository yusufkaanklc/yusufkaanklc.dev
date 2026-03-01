import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";

const log = logger("api/admin/upload");

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_TYPES = new Set([...IMAGE_TYPES, "application/pdf"]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

const VALID_CATEGORIES = new Set(["blog", "news", "resume"]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "blog";

    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json(
        { error: "Invalid category. Use: blog, news, resume" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Accepted: JPEG, PNG, WebP, AVIF, PDF" },
        { status: 400 },
      );
    }

    const isImage = IMAGE_TYPES.has(file.type);
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${isImage ? "5MB" : "10MB"})` },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", category);
    await mkdir(uploadsDir, { recursive: true });

    const ext = EXT_MAP[file.type] ?? "bin";
    const prefix = isImage ? "cover" : "resume";
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${category}/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (err) {
    log.error("POST failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
