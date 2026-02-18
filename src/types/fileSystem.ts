export interface FileNode {
  type: "file";
  name: string;
  content: string;
}

export interface DirectoryNode {
  type: "directory";
  name: string;
  children: Record<string, FileSystemNode>;
}

export type FileSystemNode = FileNode | DirectoryNode;
