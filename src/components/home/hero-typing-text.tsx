"use client";

import { useEffect, useState } from "react";

interface HeroTypingTextProps {
  text: string;
  speedMs?: number;
  pauseMs?: number;
}

export function HeroTypingText({ text, speedMs = 48, pauseMs = 2200 }: HeroTypingTextProps) {
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const displayed = text.slice(0, length);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setLength(text.length);
      setDeleting(false);
      return;
    }

    let delay = speedMs;

    if (!deleting && length < text.length) {
      delay = speedMs;
    } else if (!deleting && length === text.length) {
      delay = pauseMs;
    } else if (deleting && length > 0) {
      delay = Math.max(24, speedMs * 0.55);
    } else {
      delay = 600;
    }

    const timeout = window.setTimeout(() => {
      if (!deleting && length < text.length) {
        setLength((current) => current + 1);
        return;
      }

      if (!deleting && length === text.length) {
        setDeleting(true);
        return;
      }

      if (deleting && length > 0) {
        setLength((current) => current - 1);
        return;
      }

      setDeleting(false);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, length, pauseMs, speedMs, text]);

  return (
    <p className="hero-typing-text" aria-label={text}>
      <span aria-hidden>{displayed}</span>
      <span className="hero-typing-cursor hero-typing-cursor--blink" aria-hidden>
        |
      </span>
    </p>
  );
}
