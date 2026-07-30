import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Forwards a signup to the Google Apps Script web app, which appends a row to
// the Sheet. Runs server-side, so there's no CORS issue and the Apps Script URL
// stays out of the browser. Set SHEETS_WEBHOOK_URL to your /exec URL.
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request" },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { status: "error", message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    // Not configured yet: let the UI flow work, but warn that nothing was saved.
    console.warn(
      "[subscribe] SHEETS_WEBHOOK_URL is not set — email NOT recorded:",
      email,
    );
    return NextResponse.json({ status: "ok" });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "landing-page" }),
      redirect: "follow", // Apps Script 302-redirects to its result page
    });
    if (!res.ok) throw new Error(`Sheet endpoint responded ${res.status}`);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[subscribe] failed to record email:", err);
    return NextResponse.json(
      { status: "error", message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
