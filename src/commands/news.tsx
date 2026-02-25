import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "news",
  description: "View news",
  handler: () => {
    setTimeout(() => {
      window.location.href = "/news";
    }, 300);

    return {
      output: [
        {
          id: `news-${Date.now()}`,
          type: "system" as const,
          content: "Redirecting to news...",
        },
      ],
    };
  },
});
