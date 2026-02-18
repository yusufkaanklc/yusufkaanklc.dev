"use client";

import { useReducer, useCallback, useRef } from "react";
import { type TerminalState, type TerminalAction, type TerminalLine } from "@/types/terminal";
import { type TerminalOutputLine, type CommandContext, type SiteData } from "@/types/commands";
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
  interactiveMode: null,
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
      return { ...state, lines: [], currentInput: "" };

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

    case "SET_INTERACTIVE_MODE":
      return { ...state, interactiveMode: action.payload, currentInput: "" };

    case "ADD_INPUT_LINE": {
      const inputLine: TerminalLine = {
        id: nextLineId(),
        type: "input",
        command: action.payload.command,
        currentPath: action.payload.currentPath,
      };
      return {
        ...state,
        lines: [...state.lines, inputLine],
        currentInput: "",
      };
    }

    default:
      return state;
  }
}

export function useTerminal(theme: string, setTheme: (t: string) => void, siteData?: SiteData) {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const { history, addToHistory, navigateHistory } = useCommandHistory();
  const { complete } = useTabCompletion(state.currentPath);

  const interactiveResolveRef = useRef<((value: string) => void) | null>(null);
  const interactiveRejectRef = useRef<((reason: unknown) => void) | null>(null);

  const setInput = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT", payload: value });
  }, []);

  const setPath = useCallback((path: string) => {
    dispatch({ type: "SET_PATH", payload: path });
  }, []);

  const requestInput = useCallback((prompt: string, masked: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      interactiveResolveRef.current = resolve;
      interactiveRejectRef.current = reject;
      dispatch({ type: "SET_INTERACTIVE_MODE", payload: { prompt, masked } });
    });
  }, []);

  const resolveInteractiveInput = useCallback((value: string) => {
    if (interactiveResolveRef.current) {
      interactiveResolveRef.current(value);
      interactiveResolveRef.current = null;
      interactiveRejectRef.current = null;
    }
    dispatch({ type: "SET_INTERACTIVE_MODE", payload: null });
  }, []);

  const cancelInteractiveInput = useCallback(() => {
    if (interactiveRejectRef.current) {
      interactiveRejectRef.current(new Error("cancelled"));
      interactiveResolveRef.current = null;
      interactiveRejectRef.current = null;
    }
    dispatch({ type: "SET_INTERACTIVE_MODE", payload: null });
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
        requestInput,
        data: siteData,
      };

      const cmd = getCommand(command);

      if (cmd) {
        const result = cmd.handler(args, context);

        if (result instanceof Promise) {
          // Show the typed command immediately
          dispatch({
            type: "ADD_INPUT_LINE",
            payload: { command: trimmed, currentPath: state.currentPath },
          });
          addToHistory(trimmed);

          result.then((res) => {
            if (res.clear) {
              dispatch({ type: "CLEAR" });
              return;
            }
            if (res.output.length > 0) {
              dispatch({ type: "ADD_SYSTEM_LINES", payload: res.output });
            }
          }).catch(() => {
            // Swallow unhandled rejections from cancelled interactive input
          });
          return;
        }

        if (result.clear) {
          dispatch({ type: "CLEAR" });
          addToHistory(trimmed);
          return;
        }

        dispatch({
          type: "SUBMIT_COMMAND",
          payload: { command: trimmed, output: result.output, currentPath: state.currentPath },
        });
      } else {
        dispatch({
          type: "SUBMIT_COMMAND",
          payload: {
            command: trimmed,
            output: [
              {
                id: `err-${Date.now()}`,
                type: "error",
                content: `bash: ${command}: command not found. Type 'help' for available commands.`,
              },
            ],
            currentPath: state.currentPath,
          },
        });
      }
      addToHistory(trimmed);
    },
    [state.currentPath, history, theme, setTheme, addToHistory, requestInput, siteData]
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
    resolveInteractiveInput,
    cancelInteractiveInput,
  };
}
