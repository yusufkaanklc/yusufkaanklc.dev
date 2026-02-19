"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@/hooks/useTheme";

interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  useTheme();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [readerCount, setReaderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.slug) return;

    fetch(`/api/blog/${params.slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    // Record reader and get count
    fetch(`/api/blog/${params.slug}/readers`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setReaderCount(data.count ?? 0))
      .catch(() => {});
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary text-fg font-mono flex items-center justify-center">
        <div className="text-accent animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-bg-secondary text-fg font-mono flex flex-col items-center justify-center gap-4">
        <p className="text-t-red">Post not found.</p>
        <Link href="/" className="text-accent hover:underline text-sm">
          &larr; Back to terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary text-fg font-mono">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-accent hover:underline text-sm mb-6 inline-block">
            &larr; Back to terminal
          </Link>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 object-cover rounded-lg border border-fg-dim/20 mb-6"
            />
          )}

          <h1 className="text-2xl font-bold text-accent mb-3">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
            <span>{post.date}</span>
            <span className="text-fg-dim/40">|</span>
            <span>{post.readingTime} min read</span>
            <span className="text-fg-dim/40">|</span>
            <span>{readerCount} reader{readerCount !== 1 ? "s" : ""}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3">{post.summary}</p>
        </div>

        {/* Content */}
        {post.content && (
          <article className="prose prose-invert max-w-none blog-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
