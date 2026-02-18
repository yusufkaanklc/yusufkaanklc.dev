import { type TerminalOutputLine } from "./commands";

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
}

export type TerminalAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SUBMIT_COMMAND"; payload: { command: string; output: TerminalOutputLine[]; currentPath: string } }
  | { type: "SET_PATH"; payload: string }
  | { type: "CLEAR" }
  | { type: "ADD_SYSTEM_LINES"; payload: TerminalOutputLine[] }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "NAVIGATE_HISTORY"; payload: "up" | "down" };
