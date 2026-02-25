export function parseTags(input: string): string[] {
  return input.split(",").map((t) => t.trim()).filter(Boolean);
}
