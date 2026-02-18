import { registerCommand } from "@/core/commandRegistry";
import { resolvePath, listDirectory, readFile, getNode } from "@/core/fileSystem";
import { DirectoryListing } from "@/components/output/DirectoryListing";
import { FileContent } from "@/components/output/FileContent";

registerCommand({
  name: "ls",
  description: "List directory contents",
  usage: "ls [dir]",
  handler: (args, context) => {
    const targetPath = args[0]
      ? resolvePath(context.currentPath, args[0])
      : context.currentPath;

    const items = listDirectory(targetPath);
    if (!items) {
      return {
        output: [
          {
            id: `ls-err-${Date.now()}`,
            type: "error",
            content: `ls: cannot access '${args[0] || targetPath}': No such directory`,
          },
        ],
      };
    }

    return {
      output: [
        {
          id: `ls-${Date.now()}`,
          type: "component",
          component: <DirectoryListing items={items} />,
        },
      ],
    };
  },
});

registerCommand({
  name: "cd",
  description: "Change directory",
  usage: "cd <dir>",
  handler: (args, context) => {
    const target = args[0] || "~";
    const newPath = resolvePath(context.currentPath, target);
    const node = getNode(newPath);

    if (!node || node.type !== "directory") {
      return {
        output: [
          {
            id: `cd-err-${Date.now()}`,
            type: "error",
            content: `cd: ${args[0]}: No such directory`,
          },
        ],
      };
    }

    context.setCurrentPath(newPath);
    return { output: [] };
  },
});

registerCommand({
  name: "cat",
  description: "Read file contents",
  usage: "cat <file>",
  handler: (args, context) => {
    if (!args[0]) {
      return {
        output: [
          {
            id: `cat-err-${Date.now()}`,
            type: "error",
            content: "cat: missing file operand",
          },
        ],
      };
    }

    const filePath = resolvePath(context.currentPath, args[0]);
    const content = readFile(filePath);

    if (content === null) {
      return {
        output: [
          {
            id: `cat-err-${Date.now()}`,
            type: "error",
            content: `cat: ${args[0]}: No such file`,
          },
        ],
      };
    }

    return {
      output: [
        {
          id: `cat-${Date.now()}`,
          type: "component",
          component: <FileContent content={content} filename={args[0]} />,
        },
      ],
    };
  },
});

registerCommand({
  name: "pwd",
  description: "Print working directory",
  handler: (_args, context) => ({
    output: [
      {
        id: `pwd-${Date.now()}`,
        type: "text",
        content: `/home/visitor/${context.currentPath === "~" ? "" : context.currentPath.replace("~/", "")}`,
      },
    ],
  }),
});
