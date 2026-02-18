import { type ReactNode } from "react";

export interface CommandDefinition {
  name: string;
  description: string;
  usage?: string;
  handler: (args: string[], context: CommandContext) => CommandResult;
}

export interface CommandContext {
  currentPath: string;
  history: string[];
  setCurrentPath: (path: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export interface CommandResult {
  output: TerminalOutputLine[];
  clear?: boolean;
}

export interface TerminalOutputLine {
  id: string;
  type: "text" | "component" | "ascii" | "error" | "system";
  content?: string;
  component?: ReactNode;
  className?: string;
}
