"use client";

import { useReducer, useCallback } from "react";
import { type TerminalState, type TerminalAction, type TerminalLine } from "@/types/terminal";
import { type TerminalOutputLine, type CommandContext } from "@/types/commands";
import { parseCommand } from "@/core/commandParser";
import { getCommand } from "@/core/commandRegistry";
import { useCommandHistory } from "./useCommandHistory";
import { useTabCompletion } from "./useTabCompletion";

let lineIdCounter = 0;
function nextLineId() {
  return `line-${++lineIdCounter}`;
}

const initialState: TerminalState = {
  lines: [],
  currentInput: "",
  currentPath: "~",
  history: [],
  historyIndex: -1,
  isTyping: false,
};

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, currentInput: action.payload };

    case "SUBMIT_COMMAND": {
      const inputLine: TerminalLine = {
        id: nextLineId(),
        type: "input",
        command: action.payload.command,
        currentPath: action.payload.currentPath,
      };
      const outputLine: TerminalLine = {
        id: nextLineId(),
        type: "output",
        lines: action.payload.output,
      };
      return {
        ...state,
        lines: [...state.lines, inputLine, outputLine],
        currentInput: "",
        history: [...state.history, action.payload.command],
      };
    }

    case "SET_PATH":
      return { ...state, currentPath: action.payload };

    case "CLEAR":
      return { ...state, lines: [] };

    case "ADD_SYSTEM_LINES": {
      const sysLine: TerminalLine = {
        id: nextLineId(),
        type: "output",
        lines: action.payload,
      };
      return { ...state, lines: [...state.lines, sysLine] };
    }

    case "SET_TYPING":
      return { ...state, isTyping: action.payload };

    case "NAVIGATE_HISTORY":
      return state;

    default:
      return state;
  }
}

export function useTerminal(theme: string, setTheme: (t: string) => void) {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const { history, addToHistory, navigateHistory } = useCommandHistory();
  const { complete } = useTabCompletion(state.currentPath);

  const setInput = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT", payload: value });
  }, []);

  const setPath = useCallback((path: string) => {
    dispatch({ type: "SET_PATH", payload: path });
  }, []);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      const { command, args } = parseCommand(trimmed);

      const context: CommandContext = {
        currentPath: state.currentPath,
        history,
        setCurrentPath: (p: string) => dispatch({ type: "SET_PATH", payload: p }),
        theme,
        setTheme,
      };

      const cmd = getCommand(command);
      let output: TerminalOutputLine[];

      if (cmd) {
        const result = cmd.handler(args, context);
        if (result.clear) {
          dispatch({ type: "CLEAR" });
          addToHistory(trimmed);
          return;
        }
        output = result.output;
      } else {
        output = [
          {
            id: `err-${Date.now()}`,
            type: "error",
            content: `bash: ${command}: command not found. Type 'help' for available commands.`,
          },
        ];
      }

      dispatch({
        type: "SUBMIT_COMMAND",
        payload: { command: trimmed, output, currentPath: state.currentPath },
      });
      addToHistory(trimmed);
    },
    [state.currentPath, history, theme, setTheme, addToHistory]
  );

  const handleHistoryNavigation = useCallback(
    (direction: "up" | "down") => {
      const result = navigateHistory(direction, state.currentInput);
      if (result !== null) {
        dispatch({ type: "SET_INPUT", payload: result });
      }
    },
    [navigateHistory, state.currentInput]
  );

  const handleTab = useCallback(() => {
    const result = complete(state.currentInput);
    if (result) {
      dispatch({ type: "SET_INPUT", payload: result });
    }
  }, [complete, state.currentInput]);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const addSystemLines = useCallback((lines: TerminalOutputLine[]) => {
    dispatch({ type: "ADD_SYSTEM_LINES", payload: lines });
  }, []);

  return {
    state,
    setInput,
    executeCommand,
    handleHistoryNavigation,
    handleTab,
    clear,
    addSystemLines,
    setPath,
  };
}
