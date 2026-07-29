# DELISHAS — Coming Soon Landing Page

A single-viewport (100vh, no-scroll) coming-soon landing page built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

## Develop

```bash
npm run dev
```

Open http://localhost:3000.

## Assets

Both live in `public/`:

- `logo.mp4` — the animated DELISHAS wordmark. It's rendered with `mix-blend-multiply` so its white background disappears into the cream page, and cropped to a tight window (see `app/components/LogoVideo.tsx`).
- `comingsoon.png` — the torn-paper "COMING SOON" graphic (also `mix-blend-multiply`).

## Notify form → Google Sheet

Signups are POSTed **server-side** (via a Server Action in `app/actions.ts`) to a
Google Apps Script Web App that appends a row to your Sheet. No third-party service, no cost.

### One-time setup

1. **Create a Google Sheet.** In row 1, add headers: `Timestamp | Email | Source`.
2. **Extensions → Apps Script.** Delete the boilerplate and paste:

   ```js
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
       var data = JSON.parse(e.postData.contents);
       sheet.appendRow([new Date(), data.email, data.source || ""]);
       return ContentService
         .createTextOutput(JSON.stringify({ ok: true }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Deploy, then authorize when prompted.
4. **Copy the Web app URL** (ends in `/exec`).
5. Paste it into `.env.local`:

   ```
   SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
   ```

6. Restart `npm run dev`. Submissions now land in your Sheet.

Export the list any time via **File → Download → CSV**.
