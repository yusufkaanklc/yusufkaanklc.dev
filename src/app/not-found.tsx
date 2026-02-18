import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-bg-secondary text-fg font-mono p-4">
      <div className="max-w-lg w-full rounded-xl border border-fg-dim/15 bg-bg overflow-hidden glow-border">
        <div className="flex items-center px-4 py-2.5 bg-bg-secondary border-b border-fg-dim/15">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs text-fg-dim mx-auto">404 - Not Found</span>
        </div>
        <div className="p-6 space-y-3">
          <pre className="text-t-red text-sm">
            {`bash: 404: page not found`}
          </pre>
          <p className="text-fg-dim text-sm">
            The path you&apos;re looking for doesn&apos;t exist in this filesystem.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 text-sm text-accent hover:underline"
          >
            $ cd ~ <span className="text-fg-dim"># go back home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
