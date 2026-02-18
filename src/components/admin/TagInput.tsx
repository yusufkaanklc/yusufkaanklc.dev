"use client";

import { useState } from "react";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ label, value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-fg-dim font-medium uppercase tracking-wider">{label}</label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-accent/8 text-accent border border-accent/15 group"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-accent/40 hover:text-accent transition-colors"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 px-3 py-2.5 rounded-lg bg-bg-secondary/80 border border-fg-dim/12 text-fg text-sm outline-none focus:border-accent/40 focus:bg-bg-secondary transition-all placeholder:text-fg-dim/40"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-sm rounded-lg bg-accent/8 text-accent/80 border border-accent/15 hover:bg-accent/15 hover:text-accent transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
