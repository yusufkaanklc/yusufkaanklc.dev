"use client";

import { type TerminalOutputLine } from "@/types/commands";
import { PROMPT_USER, PROMPT_HOST } from "@/utils/constants";
import { cn } from "@/utils/cn";

export function TerminalInputLine({ command, currentPath }: { command: string; currentPath: string }) {
  return (
    <div className="flex flex-wrap">
      <span className="text-accent font-bold">{PROMPT_USER}</span>
      <span className="text-fg-dim">@</span>
      <span className="text-accent-secondary">{PROMPT_HOST}</span>
      <span className="text-fg-dim">:</span>
      <span className="text-prompt-path">{currentPath}</span>
      <span className="text-fg-dim mr-2">$</span>
      <span className="text-fg">{command}</span>
    </div>
  );
}

export function TerminalOutputLineComponent({ line }: { line: TerminalOutputLine }) {
  if (line.type === "component") {
    return <div className="my-1">{line.component}</div>;
  }

  const isAscii = line.type === "ascii";

  return (
    <pre
      className={cn(
        isAscii ? "whitespace-pre overflow-x-auto" : "whitespace-pre-wrap break-words",
        line.type === "error" && "text-t-red",
        line.type === "system" && "text-accent/70 italic",
        isAscii && "text-accent glow",
        line.type === "text" && "text-fg-muted",
        line.className
      )}
      style={isAscii ? { fontFamily: 'Consolas, "Courier New", monospace', fontFeatureSettings: "'liga' 0, 'calt' 0, 'kern' 0", fontKerning: "none", fontVariantLigatures: "none" } : undefined}
    >
      {line.content}
    </pre>
  );
}
