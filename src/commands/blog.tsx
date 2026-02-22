import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "blog",
  description: "View blog posts",
  handler: () => {
    setTimeout(() => {
      window.location.href = "/blog";
    }, 300);

    return {
      output: [
        {
          id: `blog-${Date.now()}`,
          type: "system" as const,
          content: "Redirecting to blog...",
        },
      ],
    };
  },
});
