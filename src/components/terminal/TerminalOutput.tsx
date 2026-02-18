"use client";

import { type TerminalLine as TLine } from "@/types/terminal";
import { TerminalInputLine, TerminalOutputLineComponent } from "./TerminalLine";

export function TerminalOutput({ lines }: { lines: TLine[] }) {
  return (
    <>
      {lines.map((line) => {
        if (line.type === "input") {
          return (
            <TerminalInputLine
              key={line.id}
              command={line.command || ""}
              currentPath={line.currentPath || "~"}
            />
          );
        }

        return (
          <div key={line.id} className="mb-1">
            {line.lines?.map((outputLine) => (
              <TerminalOutputLineComponent key={outputLine.id} line={outputLine} />
            ))}
          </div>
        );
      })}
    </>
  );
}
