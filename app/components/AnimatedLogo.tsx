"use client";

import { useEffect, useState } from "react";

const WORD = "DELISHAS";
const STAGGER = 0.08; // seconds between letters
const ENTRANCE = 0.7; // entrance animation duration (matches CSS)

export default function AnimatedLogo() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    // Once all letters have finished entering, switch to the gentle float loop.
    const total = (WORD.length * STAGGER + ENTRANCE) * 1000;
    const id = window.setTimeout(() => setFloating(true), total);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <h1
      aria-label={WORD}
      className="font-display text-6xl leading-none tracking-tight text-foreground select-none sm:text-7xl md:text-8xl"
    >
      {WORD.split("").map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`logo-letter${floating ? " is-floating" : ""}`}
          style={{
            animationDelay: floating
              ? `${i * 0.12}s`
              : `${i * STAGGER}s`,
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
