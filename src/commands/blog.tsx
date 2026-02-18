import { registerCommand } from "@/core/commandRegistry";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { BlogPostEntry } from "@/components/output/BlogPostEntry";

registerCommand({
  name: "blog",
  description: "View blog posts",
  handler: (_args, context) => {
    const blogPosts = context.data?.blogPosts ?? staticBlogPosts;
    return {
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
    };
  },
});
