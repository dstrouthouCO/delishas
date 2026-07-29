"use server";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

const DEFAULT_MESSAGE =
  "Be the first to know! We’ll email you as soon as we go live.";

export const initialSubscribeState: SubscribeState = {
  status: "idle",
  message: DEFAULT_MESSAGE,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    // Not configured yet — fail loudly in the server logs, softly in the UI.
    console.warn(
      "[subscribe] SHEETS_WEBHOOK_URL is not set. Add it to .env.local.",
    );
    return {
      status: "error",
      message: "Sign-up isn’t live just yet — please try again shortly.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "landing-page" }),
      // Apps Script 302-redirects to its result page; following it is fine.
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Sheet endpoint responded ${res.status}`);
    }

    return {
      status: "success",
      message: "🎉 You’re on the list! We’ll be in touch.",
    };
  } catch (err) {
    console.error("[subscribe] failed to record email:", err);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again.",
    };
  }
}
