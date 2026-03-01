"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: "blog" | "news";
}

export function ImageUpload({ value, onChange, category = "blog" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`/api/admin/upload?category=${category}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }
        onChange(data.url);
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large (max 5MB)");
        return;
      }
      upload(file);
    },
    [upload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-fg-dim font-medium uppercase tracking-wider">
        Cover Image
      </label>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-fg-dim/12 bg-bg-secondary/80 max-w-sm">
          <Image
            src={value}
            alt="Cover preview"
            width={400}
            height={225}
            className="w-full aspect-video object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs rounded bg-red-500/60 text-white hover:bg-red-500/80 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? "border-accent/60 bg-accent/10"
              : "border-fg-dim/20 bg-bg-secondary/40 hover:border-fg-dim/40 hover:bg-bg-secondary/60"
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-fg-dim text-sm">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </div>
          ) : (
            <>
              <svg
                className="h-6 w-6 text-fg-dim/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-xs text-fg-dim">
                Click or drag image here
              </span>
              <span className="text-[10px] text-fg-dim/40">
                JPEG, PNG, WebP, AVIF (max 5MB)
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-xs text-t-red">{error}</p>}
    </div>
  );
}
