# FLEX portfolio showcase

The project card now uses the wide, app-only footage described in [PROJECT-PREVIEWS.md](PROJECT-PREVIEWS.md). The phone video below is still used in the hero carousel.

Captured from the local FLEX 2.9.2 app on September 19, 2026. Four chapters show routine selection, set logging, exercise search and demonstrations, and workout history. The silent 23.2-second loops include gentle dissolves and return to their opening frame.

- Desktop: 1440 × 900, with a flat charcoal panel, Material-inspired tonal labels, and conversational chapter titles, matching the project card's 16:10 frame. The current assets use the `flex-showcase-desktop-v292-material` prefix.
- Phone: 390 × 846, with the app filling the existing phone mockup.
- MP4 files are used by the site. WebM alternatives and JPEG posters are also supplied in `static/assets/flex-showcase-*`.

The capture uses a disposable Chromium context, the app's existing demo seeder, and local-only network access. It never reads a signed-in browser profile. It removes internal test fixtures only from that temporary context's IndexedDB. The FLEX source files and personal workout data are untouched.

To refresh, start the FLEX checkout in its normal `npm run dev` pro mode, then run these commands from the portfolio repository. FLEX's existing Playwright, ffmpeg-static, Sharp, and installed Google Chrome are required.

```sh
FLEX_SOURCE=/path/to/FLEX-app FLEX_URL=http://127.0.0.1:5173 node scripts/capture-flex-showcase.mjs
FLEX_SOURCE=/path/to/FLEX-app node scripts/render-flex-showcase.mjs
```

Set `FLEX_RENDER_FORMAT=desktop` to revise only the desktop composition using the existing raw capture.

Raw recordings, chapter timings, and QA stills go to `/private/tmp/flex-showcase` (override with `FLEX_CAPTURE_DIR`). Review the new footage before updating the versioned filenames in `Hero.svelte` and `Projects.svelte`. The renderer's asset suffix should be updated for the next app version. The helper adapter reuses FLEX's maintained screenshot functions without executing the full screenshot catalog; changed app selectors may require updating the capture script.
