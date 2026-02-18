"use client";

import { useState, useEffect, useCallback } from "react";
import { TYPING_SPEED } from "@/utils/constants";

export function useTypingAnimation() {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    if (!targetText) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayedText(targetText);
      setIsComplete(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedText(targetText.slice(0, index));
      if (index >= targetText.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [targetText]);

  const startTyping = useCallback((text: string) => {
    setTargetText(text);
  }, []);

  return { displayedText, isComplete, startTyping };
}
