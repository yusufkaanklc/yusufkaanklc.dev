"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const MATRIX_GREEN = "#00ff41";
const DURATION = 6000;
const FADE_DURATION = 1000;

interface MatrixRainProps {
  onComplete: () => void;
}

export function MatrixRain({ onComplete }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"rain" | "fade" | "message">("rain");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -50);

    let animId: number;
    const startTime = Date.now();

    function draw() {
      const elapsed = Date.now() - startTime;

      if (elapsed > DURATION + FADE_DURATION) {
        cancelAnimationFrame(animId);
        setPhase("message");
        return;
      }

      if (elapsed > DURATION && phase !== "fade") {
        setPhase("fade");
      }

      const opacity = elapsed > DURATION ? 1 - (elapsed - DURATION) / FADE_DURATION : 1;

      ctx!.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.fillStyle = MATRIX_GREEN;
      ctx!.font = `${fontSize}px monospace`;
      ctx!.globalAlpha = opacity;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brighter head character
        ctx!.fillStyle = `rgba(180, 255, 180, ${opacity})`;
        ctx!.fillText(char, x, y);

        // Trail
        ctx!.fillStyle = `rgba(0, 255, 65, ${opacity * 0.8})`;

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === "message") {
      const timer = setTimeout(() => {
        onComplete();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === "message") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "black",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 1s ease-out",
      }}
    />
  );
}
