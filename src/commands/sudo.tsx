import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "sudo",
  description: "Run as superuser",
  handler: async (_args, context) => {
    let password: string;
    try {
      password = await context.requestInput("[sudo] password for admin: ", true);
    } catch {
      // Ctrl+C cancellation
      return {
        output: [
          {
            id: `sudo-${Date.now()}`,
            type: "system" as const,
            content: "^C",
          },
        ],
      };
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Small delay to let cookie set, then redirect
        setTimeout(() => {
          window.location.href = "/admin";
        }, 300);

        return {
          output: [
            {
              id: `sudo-${Date.now()}`,
              type: "system" as const,
              content: "Authentication successful. Redirecting to admin panel...",
            },
          ],
        };
      }

      return {
        output: [
          {
            id: `sudo-${Date.now()}`,
            type: "error" as const,
            content: "sudo: Authentication failure.",
          },
        ],
      };
    } catch {
      return {
        output: [
          {
            id: `sudo-${Date.now()}`,
            type: "error" as const,
            content: "sudo: Authentication service unavailable.",
          },
        ],
      };
    }
  },
});
