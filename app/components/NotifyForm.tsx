"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Where signups are sent. Defaults to our own API route (which forwards to the
// Google Apps Script → Sheet). Override with NEXT_PUBLIC_SUBSCRIBE_URL if you
// want to point at an external endpoint instead.
const SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_URL || "/api/subscribe";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NotifyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showThanks, setShowThanks] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing-page" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.status === "error") {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }
      formRef.current?.reset();
      setShowThanks(true);
    } catch (err) {
      console.error("[subscribe] failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  // Close the modal on Escape.
  useEffect(() => {
    if (!showThanks) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowThanks(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showThanks]);

  return (
    <div className="w-full max-w-[470px]">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="flex items-stretch overflow-hidden rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-accent-dark"
      >
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          required
          className="min-w-0 flex-1 bg-transparent px-6 py-4 text-base text-black placeholder:text-neutral-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center bg-accent px-8 font-bold text-black transition-colors hover:bg-accent-dark focus:outline-none disabled:opacity-60"
        >
          {pending ? "Sending…" : "Notify me"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-4 min-h-5 text-center text-sm ${
          error ? "text-red-600" : "text-black"
        }`}
      >
        {error || "Be the first to know! We’ll email you as soon as we go live."}
      </p>

      {showThanks && <ThankYouModal onClose={() => setShowThanks(false)} />}
    </div>
  );
}

function ThankYouModal({ onClose }: { onClose: () => void }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thanks-title"
    >
      {/* transparent click-catcher (no page dimming, per design) */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* card */}
      <div className="relative z-10 flex h-[260px] w-[320px] max-w-full flex-col items-center justify-center rounded-[28px] bg-white px-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.25)] sm:h-[300px] sm:w-[580px]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 text-neutral-400 transition-colors hover:text-black focus:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id="thanks-title" className="text-4xl font-bold text-black sm:text-5xl">
          <span aria-hidden="true">🎉 </span>Thank you!
        </h2>
        <p className="mt-5 text-lg text-black sm:text-xl">
          You’ll be the first to know when we go live.
        </p>
      </div>
    </div>,
    document.body,
  );
}
