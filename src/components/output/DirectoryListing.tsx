import { type FileSystemNode } from "@/types/fileSystem";

export function DirectoryListing({ items }: { items: FileSystemNode[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <span
          key={item.name}
          className={item.type === "directory" ? "text-accent font-bold" : "text-fg-muted"}
        >
          {item.name}{item.type === "directory" ? "/" : ""}
        </span>
      ))}
    </div>
  );
}
