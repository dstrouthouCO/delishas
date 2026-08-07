"use client";

import { useEffect, useRef } from "react";

// Reveal completes ~11.5s, then the source dismantles for looping — freeze just
// before that so it plays once and holds the finished wordmark.
const HOLD_AT = 11.4;

export default function LogoVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.loop = false;
    v.muted = true;

    let frozen = false;
    let raf = 0;

    const freeze = () => {
      if (frozen) return;
      frozen = true;
      cancelAnimationFrame(raf);
      v.pause();
      try {
        v.currentTime = HOLD_AT;
      } catch {
        /* metadata not ready — paused state already stops playback */
      }
    };

    const tick = () => {
      if (frozen) return;
      if (v.currentTime >= HOLD_AT || v.ended) {
        freeze();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      if (frozen) v.pause();
    };

    v.addEventListener("ended", freeze);
    v.addEventListener("play", onPlay);

    const played = v.play();
    if (played && typeof played.then === "function") {
      // Autoplay blocked / Safari power-saving → jump to the finished frame.
      played.catch(freeze);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", freeze);
      v.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[180px] overflow-hidden sm:max-w-[300px]"
      style={{ aspectRatio: "960 / 332" }}
    >
      {/* clip-path trims the video's 1–2px black edge lines (iOS Safari applies
          clip-path to <video>, unlike overflow/DOM overlays). */}
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full select-none"
        style={{ clipPath: "inset(0 3px 0 1px)" }}
        src="/logo.mp4"
        muted
        playsInline
        preload="auto"
        aria-label="DELISHAS"
      />
    </div>
  );
}
