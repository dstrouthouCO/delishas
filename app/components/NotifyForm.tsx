"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribe, initialSubscribeState } from "../actions";

export default function NotifyForm() {
  const [state, formAction, pending] = useActionState(
    subscribe,
    initialSubscribeState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the field after a successful sign-up.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <div className="w-full max-w-md">
      <form
        ref={formRef}
        action={formAction}
        className="flex items-center gap-1.5 rounded-full bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-accent-dark"
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
          className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-base text-foreground placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-accent px-6 py-2.5 font-semibold text-foreground transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Notify me"}
        </button>
      </form>

      <p
        aria-live="polite"
        className={`mt-3 min-h-5 text-center text-sm ${
          state.status === "error" ? "text-red-600" : "text-neutral-600"
        }`}
      >
        {state.message}
      </p>
    </div>
  );
}
