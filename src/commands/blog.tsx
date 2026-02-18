import { registerCommand } from "@/core/commandRegistry";
import { blogPosts } from "@/data/blog";
import { BlogPostEntry } from "@/components/output/BlogPostEntry";

registerCommand({
  name: "blog",
  description: "View blog posts",
  handler: () => ({
    output: [
      {
        id: `blog-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mb-2">Blog Posts:</p>,
      },
      ...blogPosts.map((post, i) => ({
        id: `blog-${i}-${Date.now()}`,
        type: "component" as const,
        component: <BlogPostEntry post={post} />,
      })),
    ],
  }),
});
