import { type CommandDefinition } from "@/types/commands";

export function HelpTable({ commands }: { commands: CommandDefinition[] }) {
  return (
    <div className="space-y-1">
      <p className="text-accent font-bold mb-2">Available Commands:</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {commands.map((cmd) => (
          <div key={cmd.name} className="contents">
            <span className="text-accent">{cmd.usage || cmd.name}</span>
            <span className="text-fg-dim">{cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
