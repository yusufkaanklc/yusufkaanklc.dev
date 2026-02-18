export function parseCommand(input: string): { command: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { command: "", args: [] };

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}
