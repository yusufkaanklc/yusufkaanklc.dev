import { type FileSystemNode, type DirectoryNode } from "@/types/fileSystem";

let root: DirectoryNode = {
  type: "directory",
  name: "~",
  children: {},
};

export function setFileSystemRoot(newRoot: DirectoryNode) {
  root = newRoot;
}

export function getRoot(): DirectoryNode {
  return root;
}

export function resolvePath(currentPath: string, targetPath: string): string {
  if (targetPath === "~" || targetPath === "") return "~";
  if (targetPath === "/") return "~";

  let parts: string[];
  if (targetPath.startsWith("~")) {
    parts = targetPath.split("/").filter(Boolean);
  } else if (targetPath.startsWith("/")) {
    parts = ["~", ...targetPath.split("/").filter(Boolean)];
  } else {
    parts = [...currentPath.split("/").filter(Boolean), ...targetPath.split("/").filter(Boolean)];
  }

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (resolved.length > 1) resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  return resolved.join("/") || "~";
}

export function getNode(path: string): FileSystemNode | null {
  if (path === "~") return root;

  const parts = path.split("/").filter(Boolean);
  let current: FileSystemNode = root;

  for (let i = 1; i < parts.length; i++) {
    if (current.type !== "directory") return null;
    const child: FileSystemNode | undefined = current.children[parts[i]];
    if (!child) return null;
    current = child;
  }

  return current;
}

export function listDirectory(path: string): FileSystemNode[] | null {
  const node = getNode(path);
  if (!node || node.type !== "directory") return null;
  return Object.values(node.children);
}

export function readFile(path: string): string | null {
  const node = getNode(path);
  if (!node || node.type !== "file") return null;
  return node.content;
}

export function getChildNames(path: string): string[] {
  const node = getNode(path);
  if (!node || node.type !== "directory") return [];
  return Object.keys(node.children).map((name) => {
    const child = node.children[name];
    return child.type === "directory" ? name + "/" : name;
  });
}
