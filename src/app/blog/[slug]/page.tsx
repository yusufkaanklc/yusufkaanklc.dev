import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { ThemeApplier, ReaderCount } from "./BlogClientParts";

interface BlogPostData {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
      summary: post.summary,
      content: post.content,
      tags: post.tags,
      coverImage: post.coverImage,
      readingTime: post.readingTime,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const baseUrl = "https://yusufkaanklc.dev";

  return {
    title: `${post.title} | Yusuf Kaan Kilic`,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: "Yusuf Kaan Kilic" }],
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: "yusufkaanklc.dev",
      type: "article",
      locale: "en_US",
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Yusuf Kaan Kilic",
      url: "https://yusufkaanklc.dev",
    },
    ...(post.coverImage && { image: post.coverImage }),
    keywords: post.tags.join(", "),
    url: `https://yusufkaanklc.dev/blog/${post.slug}`,
  };

  return (
    <>
      <ThemeApplier />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-bg-secondary text-fg font-mono">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-accent hover:underline text-sm mb-6 inline-block"
            >
              &larr; Back to terminal
            </Link>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg border border-fg-dim/20 mb-6"
              />
            )}

            <h1 className="text-2xl font-bold text-accent mb-3">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
              <span>{post.date}</span>
              <span className="text-fg-dim/40">|</span>
              <span>{post.readingTime} min read</span>
              <span className="text-fg-dim/40">|</span>
              <ReaderCount slug={post.slug} />
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

            <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3">
              {post.summary}
            </p>
          </div>

          {/* Content */}
          {post.content && (
            <article className="prose prose-invert max-w-none blog-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
