"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/openapi/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1b26",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#16161e",
          border: "1px solid rgba(122, 162, 247, 0.15)",
          borderRadius: "0.75rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            color: "#7aa2f7",
            fontSize: "1.1rem",
            margin: 0,
            textAlign: "center",
          }}
        >
          API Documentation
        </h1>
        <p
          style={{
            color: "#565f89",
            fontSize: "0.85rem",
            margin: 0,
            textAlign: "center",
          }}
        >
          Enter password to access Swagger UI
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            background: "#1a1b26",
            border: "1px solid rgba(122, 162, 247, 0.2)",
            borderRadius: "0.5rem",
            padding: "0.6rem 0.8rem",
            color: "#c0caf5",
            fontSize: "0.9rem",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        {error && (
          <p style={{ color: "#f7768e", fontSize: "0.8rem", margin: 0 }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            background: "#7aa2f7",
            color: "#1a1b26",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.6rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !password ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
