"use client";

import { useEffect, useRef } from "react";

// Reveal completes ~11.5s, then the source dismantles for looping — freeze just
// before that.
const HOLD_AT = 11.4;
// The video has 1–2px black encoding lines on its left/right edges; skip this
// many source pixels each side when drawing so they never appear (the letters
// start ~2px in, so this trims only the artifact, not the wordmark).
const CROP_X = 2;

export default function LogoVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let frozen = false;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    // Draw the current frame, cropping the artifact columns off each side.
    const draw = () => {
      sizeCanvas();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (video.readyState >= 2 && video.videoWidth) {
        const sw = video.videoWidth - CROP_X * 2;
        ctx.drawImage(video, CROP_X, 0, sw, video.videoHeight, 0, 0, w, h);
      }
    };

    const loop = () => {
      draw();
      if (!frozen && video.currentTime >= HOLD_AT) {
        frozen = true;
        video.pause();
        draw();
        return; // finished frame stays painted; stop the rAF loop
      }
      raf = requestAnimationFrame(loop);
    };

    // Autoplay blocked / Safari power-saving a muted video → paint the finished
    // frame instead of a blank/partial one.
    const freezeToHold = () => {
      if (frozen) return;
      frozen = true;
      cancelAnimationFrame(raf);
      video.pause();
      const onSeeked = () => {
        draw();
        video.removeEventListener("seeked", onSeeked);
      };
      video.addEventListener("seeked", onSeeked);
      try {
        video.currentTime = HOLD_AT;
      } catch {
        draw();
      }
    };

    const start = () => {
      video.muted = true;
      raf = requestAnimationFrame(loop);
      const played = video.play();
      if (played && typeof played.then === "function") {
        played.catch(freezeToHold);
      }
      // Safari may start then pause to save power — detect the stall.
      window.setTimeout(() => {
        if (!frozen && video.currentTime < 1) freezeToHold();
      }, 1600);
    };

    draw();
    if (video.readyState >= 2) start();
    else video.addEventListener("loadeddata", start, { once: true });

    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", draw);
      video.removeEventListener("loadeddata", start);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[180px] sm:max-w-[300px]"
      style={{ aspectRatio: "962 / 332" }}
    >
      {/* Source video is invisible (opacity-0) so Safari's video overlay can't
          cover the canvas; it's still decoded/played as the frame source. */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        src="/logo.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full select-none"
        role="img"
        aria-label="DELISHAS"
      />
    </div>
  );
}
