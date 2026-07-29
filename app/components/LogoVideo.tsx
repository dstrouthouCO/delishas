"use client";

export default function LogoVideo() {
  return (
    <div
      className="relative w-full max-w-[420px] overflow-hidden sm:max-w-[520px]"
      style={{ aspectRatio: "16 / 6" }}
    >
      <video
        className="absolute left-0 top-1/2 w-full -translate-y-1/2 select-none mix-blend-multiply"
        src="/logo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="DELISHAS"
      />
    </div>
  );
}
