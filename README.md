# Story Maker — Voice Studio & Video Creator

A companion PWA to Story Maker: record family members' voices for each phrase
in the story engine, then generate a narrated, animated video of any story
in whichever voice you pick. Fully offline once installed, no accounts, no
data leaves the device (recordings live only in this browser's memory for a
session — download the zip / video before closing the tab).

## Files
- `index.html` — the app, with PWA hooks added
- `manifest.webmanifest` — app name, colours, icons
- `sw.js` — service worker (caches everything for offline use, including the
  JSZip script the first time it loads successfully)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon-180.png`
  — reused from the main Story Maker app for consistent branding

## Important: microphone access needs two things
1. **HTTPS.** A browser will not grant microphone access to a page opened
   directly from disk (`file://`) or without a certificate. This is exactly
   why this needs to be hosted, same as the main app.
2. **A real, separate browser tab — not Claude's in-app artifact preview.**
   Claude's own preview sandboxes out camera/microphone access entirely (by
   design, for any artifact), so recording will always fail there with
   "Permission denied," no matter how it's hosted. Once deployed to GitHub
   Pages (or any HTTPS host) and opened in Safari/Chrome directly, the browser
   will show a normal microphone permission prompt and it'll work.

## Deploying to GitHub Pages
1. Create a new GitHub repository (e.g. `story-studio`).
2. Upload all the files in this folder to the repo root — either:
   - **Web UI**: on the repo page, "Add file" → "Upload files" → drag in all
     six files (or the whole folder) → Commit.
   - **Git CLI**: `git add . && git commit -m "Voice Studio" && git push`
3. Go to **Settings → Pages** → under "Build and deployment," choose
   **Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
4. GitHub gives you a URL like `https://your-username.github.io/story-studio/`.
   Wait a minute or two for the first deploy, then open that link.
5. **Open the link directly in Safari (iPhone) or Chrome (Android)** — not
   inside the Claude app — so the microphone prompt works.
6. Tap "Test microphone access" at the top of the page — it should turn ✅.
7. To install as an app icon: Safari → Share → "Add to Home Screen";
   Chrome → menu (⋮) → "Install app."

## Updating later
When you change `index.html`, bump `CACHE` in `sw.js` (e.g. `voice-studio-v2`)
so installed copies pick up the change, then push again — GitHub Pages
redeploys automatically on every push to `main`.

## Zero-spend note
GitHub Pages is free for public repositories. No hosting fees, no app-store
fees — consistent with the "no spend until proven" rule for the whole project.
