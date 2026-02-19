import { registerCommand } from "@/core/commandRegistry";
import { fortunes } from "@/data/fortunes";

registerCommand({
  name: "fortune",
  description: "Display a random dev fortune",
  hidden: true,
  handler: () => {
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const maxContentWidth = 56;

    const wrapLine = (line: string): string[] => {
      if (line.length <= maxContentWidth) return [line];
      const words = line.split(" ");
      const wrapped: string[] = [];
      let current = "";
      for (const word of words) {
        if (current && current.length + 1 + word.length > maxContentWidth) {
          wrapped.push(current);
          current = word;
        } else {
          current = current ? current + " " + word : word;
        }
      }
      if (current) wrapped.push(current);
      return wrapped;
    };

    const lines = fortune.text.split("\n").flatMap(wrapLine);
    const authorLine = "-- " + fortune.author;
    const allLines = [...lines, authorLine];
    const maxLen = Math.max(...allLines.map((l) => l.length));
    const width = maxLen + 4;

    const border = "+" + "-".repeat(width) + "+";
    const padLine = (line: string) => {
      const padding = width - line.length - 4;
      return "|  " + line + " ".repeat(padding) + "  |";
    };

    const box = [
      border,
      ...lines.map(padLine),
      padLine(""),
      padLine(authorLine),
      border,
    ].join("\n");

    return {
      output: [
        {
          id: `fortune-${Date.now()}`,
          type: "text" as const,
          content: box,
          className: "text-t-green",
        },
      ],
    };
  },
});
