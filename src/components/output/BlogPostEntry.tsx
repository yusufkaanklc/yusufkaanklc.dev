import { type BlogPost } from "@/data/blog";

export function BlogPostEntry({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;

  return (
    <div className="border-l-2 border-accent/30 pl-3 py-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-accent-secondary/60">[{post.date}]</span>
        <a
          href={href}
          className="text-accent font-bold hover:underline"
        >
          {post.title}
        </a>
        <span className="text-xs text-fg-dim">{post.readingTime} min read</span>
      </div>
      <p className="text-fg-dim text-sm mt-0.5">{post.summary}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-accent-secondary/70">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
