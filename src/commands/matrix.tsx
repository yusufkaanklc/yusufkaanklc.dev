"use client";

import { registerCommand } from "@/core/commandRegistry";
import { MatrixRain } from "@/components/output/MatrixRain";
import { useState } from "react";

function MatrixOutput() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="text-t-green">
        <p>Wake up, Neo...</p>
        <p>The Matrix has you...</p>
        <p>Follow the white rabbit.</p>
      </div>
    );
  }

  return <MatrixRain onComplete={() => setDone(true)} />;
}

registerCommand({
  name: "matrix",
  description: "Enter the Matrix",
  hidden: true,
  handler: () => {
    return {
      output: [
        {
          id: `matrix-${Date.now()}`,
          type: "component" as const,
          component: <MatrixOutput />,
        },
      ],
    };
  },
});
