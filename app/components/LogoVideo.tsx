"use client";

import { useEffect, useRef } from "react";

// The logo assembles over the first ~8.8s, then dismantles so the source could
// loop. We play it once and freeze on the finished wordmark. The video's white
// background matches the white page, so it blends in every browser (no blend
// mode / canvas needed).
const HOLD_AT = 8.7;

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
        /* seek not ready — the paused state already stops playback */
      }
    };

    // Per-frame watchdog: stop and pin the finished frame once playback reaches
    // the hold point (or ends). Reliable regardless of timeupdate cadence.
    const tick = () => {
      if (frozen) return;
      if (v.currentTime >= HOLD_AT || v.ended) {
        freeze();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Once frozen, ignore any attempt to start playing again.
    const onPlay = () => {
      if (frozen) v.pause();
    };

    v.addEventListener("ended", freeze);
    v.addEventListener("play", onPlay);

    const played = v.play();
    if (played && typeof played.then === "function") {
      // Autoplay blocked / Safari power-saving → show the finished logo instead
      // of a blank first frame.
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
      className="relative w-full max-w-[420px] overflow-hidden sm:max-w-[520px]"
      style={{ aspectRatio: "16 / 6" }}
    >
      <video
        ref={ref}
        className="absolute left-0 top-1/2 w-full -translate-y-1/2 select-none"
        src="/logo.mp4"
        muted
        playsInline
        preload="auto"
        aria-label="DELISHAS"
      />
    </div>
  );
}
