export function FileContent({ content, filename }: { content: string; filename: string }) {
  return (
    <div>
      <p className="text-fg-dim text-xs mb-1">--- {filename} ---</p>
      <pre className="text-fg-muted whitespace-pre-wrap text-sm">{content}</pre>
    </div>
  );
}
