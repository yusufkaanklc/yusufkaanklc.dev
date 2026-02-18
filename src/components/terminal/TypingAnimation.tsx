"use client";

import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useEffect } from "react";

export function TypingAnimation({
  text,
  onComplete,
  className,
}: {
  text: string;
  onComplete?: () => void;
  className?: string;
}) {
  const { displayedText, isComplete, startTyping } = useTypingAnimation();

  useEffect(() => {
    startTyping(text);
  }, [text, startTyping]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-blink">|</span>}
    </span>
  );
}
