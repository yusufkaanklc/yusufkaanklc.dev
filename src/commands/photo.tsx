import { registerCommand } from "@/core/commandRegistry";
import { asciiPortrait } from "@/data/asciiArt";

registerCommand({
  name: "photo",
  description: "Display ASCII portrait",
  handler: () => {
    return {
      output: [
        {
          id: `photo-${Date.now()}`,
          type: "ascii" as const,
          content: asciiPortrait.join("\n"),
          className: "text-[4px] leading-[4.5px] sm:text-[5px] sm:leading-[5.5px]",
        },
      ],
    };
  },
});
