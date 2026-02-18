import { type BlogPost } from "@/data/blog";

export function BlogPostEntry({ post }: { post: BlogPost }) {
  return (
    <div className="border-l-2 border-accent/30 pl-3 py-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-accent-secondary/60">[{post.date}]</span>
        {post.url ? (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-bold hover:underline"
          >
            {post.title}
          </a>
        ) : (
          <span className="text-accent font-bold">{post.title}</span>
        )}
      </div>
      <p className="text-fg-dim text-sm mt-0.5">{post.summary}</p>
    </div>
  );
}
