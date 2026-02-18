import { type TerminalOutputLine } from "./commands";

export interface InteractiveMode {
  prompt: string;
  masked: boolean;
}

export interface TerminalLine {
  id: string;
  type: "input" | "output";
  command?: string;
  currentPath?: string;
  lines?: TerminalOutputLine[];
}

export interface TerminalState {
  lines: TerminalLine[];
  currentInput: string;
  currentPath: string;
  history: string[];
  historyIndex: number;
  isTyping: boolean;
  interactiveMode: InteractiveMode | null;
}

export type TerminalAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SUBMIT_COMMAND"; payload: { command: string; output: TerminalOutputLine[]; currentPath: string } }
  | { type: "SET_PATH"; payload: string }
  | { type: "CLEAR" }
  | { type: "ADD_SYSTEM_LINES"; payload: TerminalOutputLine[] }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "NAVIGATE_HISTORY"; payload: "up" | "down" }
  | { type: "SET_INTERACTIVE_MODE"; payload: InteractiveMode | null }
  | { type: "ADD_INPUT_LINE"; payload: { command: string; currentPath: string } };
