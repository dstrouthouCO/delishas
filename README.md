# DELISHAS — Coming Soon Landing Page

A single-viewport (100vh, no-scroll) coming-soon landing page built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

## Develop

```bash
npm run dev
```

Open http://localhost:3000.

## Assets

Live in `public/`:

- `logo.mp4` — the animated DELISHAS wordmark. Rendered with `mix-blend-multiply` so its white background disappears into the page, cropped to a tight window, and played **once** (freezes on the finished logo — see `app/components/LogoVideo.tsx`).
- `comingsoon.png` — the torn-paper "COMING SOON" graphic (`unoptimized` so swapping the file just needs a reload).
- `social/*.svg` — the footer social icons.

## Notify form → Google Sheet

Signups flow: **form → `/api/subscribe` (server route) → Google Apps Script → Google Sheet.**
The route (`app/api/subscribe/route.ts`) runs server-side, so there's no CORS and the
Apps Script URL is never exposed to the browser. No third-party service, no cost.

### One-time setup

1. **Create a Google Sheet.** In row 1, add headers: `Timestamp | Email | Source`.
2. **Extensions → Apps Script.** Delete the boilerplate and paste (replace the ID):

   ```js
   var SHEET_ID = "YOUR_SHEET_ID"; // the /d/<THIS>/edit part of the Sheet URL

   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
       if (sheet.getLastRow() === 0) sheet.appendRow(["Timestamp", "Email", "Source"]);
       var data = JSON.parse(e.postData.contents);
       var email = (data.email || "").toString().trim();
       if (!email) return json({ status: "error", message: "No email" });
       sheet.appendRow([new Date(), email, data.source || ""]);
       return json({ status: "ok" });
     } catch (err) {
       return json({ status: "error", message: String(err) });
     }
   }

   function json(obj) {
     return ContentService.createTextOutput(JSON.stringify(obj))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app** — *Execute as:* **Me**, *Who has access:* **Anyone**. Authorize, then copy the `/exec` URL.
4. Put it in `.env.local`:

   ```
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
   ```

5. Restart `npm run dev`. Submissions now land in your Sheet (export via **File → Download → CSV**).

> In production, set `SHEETS_WEBHOOK_URL` in your host's environment variables (server-only).

## Launch checklist (un-hide from search engines)

The site is intentionally **de-indexed** while in coming-soon mode. To go live:

1. Remove the `robots` block in `app/layout.tsx`.
2. Remove the `headers()` function in `next.config.ts` (the `X-Robots-Tag`).
3. In `app/robots.ts`, change `disallow: "/"` → `allow: "/"`.
