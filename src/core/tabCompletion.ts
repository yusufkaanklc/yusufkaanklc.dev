import { getCommandNames } from "./commandRegistry";
import { getChildNames, resolvePath } from "./fileSystem";
import { themes, type ThemeName } from "@/types/theme";

export function getCompletions(input: string, currentPath: string): string[] {
  const trimmed = input.trimStart();
  if (trimmed.endsWith(" ")) return [];
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) {
    const prefix = parts[0] || "";
    return getCommandNames().filter((cmd) => cmd.startsWith(prefix));
  }

  const command = parts[0];
  const partial = parts[parts.length - 1] || "";

  if (command === "theme") {
    return (Object.keys(themes) as ThemeName[]).filter((t) => t.startsWith(partial));
  }

  if (["cd", "ls", "cat"].includes(command)) {
    const lastSlash = partial.lastIndexOf("/");
    let dirPath: string;
    let prefix: string;

    if (lastSlash >= 0) {
      const dirPart = partial.substring(0, lastSlash) || ".";
      prefix = partial.substring(lastSlash + 1);
      dirPath = resolvePath(currentPath, dirPart);
    } else {
      prefix = partial;
      dirPath = currentPath;
    }

    const children = getChildNames(dirPath);
    return children.filter((name) => name.startsWith(prefix));
  }

  return [];
}

export function applyCompletion(input: string, completion: string): string {
  const parts = input.trimStart().split(/\s+/);

  if (parts.length <= 1) {
    return completion + " ";
  }

  const partial = parts[parts.length - 1] || "";
  const lastSlash = partial.lastIndexOf("/");

  if (lastSlash >= 0) {
    const dirPart = partial.substring(0, lastSlash + 1);
    parts[parts.length - 1] = dirPart + completion;
  } else {
    parts[parts.length - 1] = completion;
  }

  const result = parts.join(" ");
  return completion.endsWith("/") ? result : result + " ";
}
