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
    <div className="space-y-1">
      <label className="block text-sm text-fg-muted">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-accent/10 text-accent border border-accent/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-accent/60 hover:text-accent ml-0.5"
            >
              x
            </button>
          </span>
        ))}
      </div>
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
          className="flex-1 px-3 py-2 rounded bg-bg-secondary border border-fg-dim/20 text-fg text-sm outline-none focus:border-accent/50 transition-colors"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-sm rounded bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
