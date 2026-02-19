import { type CommandDefinition } from "@/types/commands";

const commands = new Map<string, CommandDefinition>();

export function registerCommand(definition: CommandDefinition) {
  commands.set(definition.name, definition);
}

export function getCommand(name: string): CommandDefinition | undefined {
  return commands.get(name);
}

export function getAllCommands(): CommandDefinition[] {
  return Array.from(commands.values());
}

export function getCommandNames(): string[] {
  return Array.from(commands.keys());
}

export function getVisibleCommandNames(): string[] {
  return Array.from(commands.entries())
    .filter(([, cmd]) => cmd.hidden !== true)
    .map(([name]) => name);
}
