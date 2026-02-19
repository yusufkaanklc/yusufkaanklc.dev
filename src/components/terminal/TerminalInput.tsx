"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { PROMPT_USER, PROMPT_HOST } from "@/utils/constants";
import { type InteractiveMode } from "@/types/terminal";

function InteractiveInput({
  mode,
  onSubmit,
  onCancel,
}: {
  mode: InteractiveMode;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  return (
    <div className="flex items-center">
      <span className="text-fg-dim mr-2">{mode.prompt}</span>
      <div className="relative flex-1 min-w-[100px]">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit(value);
            } else if (e.key === "c" && e.ctrlKey) {
              e.preventDefault();
              onCancel();
            }
          }}
          className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          aria-label="Password input"
        />
        <span className="text-fg pointer-events-none">
          {mode.masked ? "*".repeat(value.length) : value}
        </span>
        <span className="inline-block w-2 h-[1.2em] bg-accent/80 ml-px animate-blink align-middle" />
      </div>
    </div>
  );
}

interface TerminalInputProps {
  value: string;
  currentPath: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onHistoryNav: (direction: "up" | "down") => void;
  onTab: () => void;
  onClear: () => void;
  interactiveMode?: InteractiveMode | null;
  onInteractiveSubmit?: (value: string) => void;
  onInteractiveCancel?: () => void;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput(
    { value, currentPath, onChange, onSubmit, onHistoryNav, onTab, onClear, interactiveMode, onInteractiveSubmit, onInteractiveCancel },
    ref
  ) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

    if (interactiveMode && onInteractiveSubmit && onInteractiveCancel) {
      return <InteractiveInput mode={interactiveMode} onSubmit={onInteractiveSubmit} onCancel={onInteractiveCancel} />;
    }

    return (
      <div className="flex items-center">
        <span className="shrink-0 text-accent font-bold">{PROMPT_USER}</span>
        <span className="shrink-0 text-fg-dim">@</span>
        <span className="shrink-0 text-accent-secondary">{PROMPT_HOST}</span>
        <span className="shrink-0 text-fg-dim">:</span>
        <span className="shrink-0 text-prompt-path">{currentPath}</span>
        <span className="shrink-0 text-fg-dim mr-2">$</span>

        <div className="relative flex-1 min-w-[100px]">
          <input
            ref={localRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit(value);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                onHistoryNav("up");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                onHistoryNav("down");
              } else if (e.key === "Tab") {
                e.preventDefault();
                onTab();
              } else if (e.key === "l" && e.ctrlKey) {
                e.preventDefault();
                onClear();
              }
            }}
            className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
          <span className="text-fg pointer-events-none whitespace-pre">{value}</span>
          <span className="inline-block w-2 h-[1.2em] bg-accent/80 ml-px animate-blink align-middle" />
        </div>
      </div>
    );
  }
);
