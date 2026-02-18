import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "sudo",
  description: "Run as superuser",
  handler: () => ({
    output: [
      {
        id: `sudo-${Date.now()}`,
        type: "error",
        content: "Nice try! But you don't have sudo privileges here. 😏",
      },
    ],
  }),
});
