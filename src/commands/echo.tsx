import { registerCommand } from "@/core/commandRegistry";

registerCommand({
  name: "echo",
  description: "Print text to terminal",
  usage: "echo <text>",
  handler: (args) => ({
    output: [
      {
        id: `echo-${Date.now()}`,
        type: "text",
        content: args.join(" "),
      },
    ],
  }),
});
