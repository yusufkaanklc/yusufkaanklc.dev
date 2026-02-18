"use client";

import { useCallback } from "react";
import { getCompletions, applyCompletion } from "@/core/tabCompletion";

export function useTabCompletion(currentPath: string) {
  const complete = useCallback(
    (input: string): string | null => {
      const completions = getCompletions(input, currentPath);

      if (completions.length === 1) {
        return applyCompletion(input, completions[0]);
      }

      return null;
    },
    [currentPath]
  );

  return { complete };
}
