"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { KONAMI_SEQUENCE } from "@/utils/constants";

export function useKonamiCode() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [activated, setActivated] = useState(false);
  const keysRef = useRef<string[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isGlitching) return;

      keysRef.current = [...keysRef.current, e.key].slice(-KONAMI_SEQUENCE.length);

      const match = keysRef.current.length === KONAMI_SEQUENCE.length &&
        keysRef.current.every((key, i) => key === KONAMI_SEQUENCE[i]);

      if (match) {
        keysRef.current = [];
        setIsGlitching(true);
        setActivated(true);
        setTimeout(() => {
          setIsGlitching(false);
        }, 3000);
      }
    },
    [isGlitching]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { isGlitching, activated };
}
