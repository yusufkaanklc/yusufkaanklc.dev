import type { ReactNode } from "react";

interface OutputEntry {
  id: string;
  type: "component";
  component: ReactNode;
}

export function commandHeader(prefix: string, label: string): OutputEntry {
  return {
    id: `${prefix}-header-${Date.now()}`,
    type: "component",
    component: <p className="text-accent font-bold mb-2">{label}</p>,
  };
}

export function commandItems<T>(
  prefix: string,
  items: T[],
  render: (item: T, index: number) => ReactNode,
): OutputEntry[] {
  return items.map((item, i) => ({
    id: `${prefix}-${i}-${Date.now()}`,
    type: "component" as const,
    component: render(item, i),
  }));
}

export function commandListOutput<T>(
  prefix: string,
  label: string,
  items: T[],
  render: (item: T, index: number) => ReactNode,
): OutputEntry[] {
  return [commandHeader(prefix, label), ...commandItems(prefix, items, render)];
}
