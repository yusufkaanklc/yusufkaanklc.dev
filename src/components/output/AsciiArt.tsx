export function AsciiArt({ text }: { text: string }) {
  return (
    <pre className="text-accent font-mono text-xs sm:text-sm leading-tight whitespace-pre select-none">
      {text}
    </pre>
  );
}
