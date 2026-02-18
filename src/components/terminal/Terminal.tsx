"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { useTheme } from "@/hooks/useTheme";
import { useSiteData } from "@/contexts/DataContext";
import { setFileSystemRoot } from "@/core/fileSystem";
import { buildFileSystem } from "@/data/fileSystemData";
import { asciiLogo, welcomeLines } from "@/data/asciiArt";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";

// Register all commands via side-effect imports
import "@/commands";

const MOBILE_COMMANDS = ["help", "about", "projects", "skills", "experience", "resume", "contact", "clear"];

export function Terminal() {
  const { theme, setTheme } = useTheme();
  const { data, loading } = useSiteData();
  const {
    state,
    setInput,
    executeCommand,
    handleHistoryNavigation,
    handleTab,
    clear,
    addSystemLines,
    resolveInteractiveInput,
    cancelInteractiveInput,
  } = useTerminal(theme, setTheme, data ?? undefined);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize file system and show welcome
  useEffect(() => {
    if (data) {
      setFileSystemRoot(buildFileSystem(data));
    } else {
      setFileSystemRoot(buildFileSystem());
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      addSystemLines([
        {
          id: "ascii-banner",
          type: "ascii",
          content: asciiLogo.join("\n"),
        },
        ...welcomeLines.map((line, i) => ({
          id: `welcome-${i}`,
          type: "system" as const,
          content: line,
        })),
      ]);
    }
  }, [addSystemLines, data]);

  // Auto-scroll only on new lines
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.lines]);

  // Refocus input when interactive mode ends
  useEffect(() => {
    if (!state.interactiveMode) {
      // Small delay to let the normal input render and ref attach
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [state.interactiveMode]);

  // Keep input focused on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMobileCommand = useCallback(
    (cmd: string) => {
      executeCommand(cmd);
    },
    [executeCommand]
  );

  if (loading) {
    return (
      <div className="terminal-container flex flex-col h-[100dvh] max-w-5xl mx-auto p-2 sm:p-4 md:p-8">
        <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-fg-dim/15 bg-bg overflow-hidden glow-border transition-colors duration-300 items-center justify-center">
          <span className="text-accent animate-pulse font-mono">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-container flex flex-col h-[100dvh] max-w-5xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-fg-dim/15 bg-bg overflow-hidden glow-border transition-colors duration-300">
        <TerminalHeader currentPath={state.currentPath} />

        {/* Scanline overlay */}
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 pointer-events-none z-10 scanline-overlay opacity-[0.02]" />

          <div
            ref={scrollRef}
            onClick={focusInput}
            className="h-full overflow-y-auto p-4 font-mono text-sm leading-relaxed cursor-text"
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            <TerminalOutput lines={state.lines} />
            <TerminalInput
              ref={inputRef}
              value={state.currentInput}
              currentPath={state.currentPath}
              onChange={setInput}
              onSubmit={executeCommand}
              onHistoryNav={handleHistoryNavigation}
              onTab={handleTab}
              onClear={clear}
              interactiveMode={state.interactiveMode}
              onInteractiveSubmit={resolveInteractiveInput}
              onInteractiveCancel={cancelInteractiveInput}
            />
          </div>
        </div>

        {/* Mobile command bar */}
        {isMobile && (
          <div className="flex gap-1.5 p-2 bg-bg-secondary border-t border-fg-dim/15 overflow-x-auto shrink-0">
            {MOBILE_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleMobileCommand(cmd)}
                className="px-3 py-1.5 text-xs rounded bg-accent/10 text-accent border border-accent/20 whitespace-nowrap hover:bg-accent/20 active:bg-accent/30 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
