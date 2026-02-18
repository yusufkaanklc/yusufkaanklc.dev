"use client";

import { useState, useCallback } from "react";
import { MAX_HISTORY } from "@/utils/constants";

export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");

  const addToHistory = useCallback((command: string) => {
    if (!command.trim()) return;
    setHistory((prev) => {
      const next = [...prev, command];
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
    });
    setHistoryIndex(-1);
    setSavedInput("");
  }, []);

  const navigateHistory = useCallback(
    (direction: "up" | "down", currentInput: string): string | null => {
      if (history.length === 0) return null;

      if (direction === "up") {
        if (historyIndex === -1) {
          setSavedInput(currentInput);
          const newIndex = history.length - 1;
          setHistoryIndex(newIndex);
          return history[newIndex];
        } else if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          return history[newIndex];
        }
      } else {
        if (historyIndex === -1) return null;
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          return history[newIndex];
        } else {
          setHistoryIndex(-1);
          return savedInput;
        }
      }

      return null;
    },
    [history, historyIndex, savedInput]
  );

  return { history, addToHistory, navigateHistory };
}
