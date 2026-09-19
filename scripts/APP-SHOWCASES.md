# FoodNotes and Traffic showcases

The project cards now use the wide, app-only footage described in [PROJECT-PREVIEWS.md](PROJECT-PREVIEWS.md). The phone videos below are still used in the hero carousel.

Recorded September 19, 2026 from the current local app checkouts (FoodNotes HEAD `9ef69ec`, Traffic HEAD `8e15114`; recordings include local working-tree changes). These replace the FoodNotes stills and old Traffic clips in the project cards and hero phone carousel.

Each silent loop is 23.2 seconds at 30 fps, with four chapters, 0.4-second dissolves, and a return to the opening frame. Desktop compositions are 1440 × 900; phone footage is 390 × 846. MP4/H.264 files are used on the site, with JPEG posters and WebM/VP9 alternatives alongside them in `static/assets/`. Desktop captions follow FLEX's composition, using sage colors for FoodNotes and navy/blue for Traffic.

- FoodNotes: daily journal, meal nutrition details, history calendar, and protein trends.
- Traffic: incident feed, SDPD source filter, interactive map, and activity statistics.

The footage uses FoodNotes' built-in development fixtures and Traffic's in-memory mock API. Traffic incident counts and events are demonstration data, not a live report. Chrome contexts are disposable and requests are restricted to localhost. No signed-in browser profile, real journal data, or production writes are used. The source apps are not modified by the capture scripts.

## Refreshing the footage

Use a checkout containing `playwright`, `ffmpeg-static`, and `sharp` for `MEDIA_TOOLS_SOURCE` (the existing FLEX checkout was used here), plus installed Google Chrome.

1. Start FoodNotes in development mode on port 5175: `npm run dev -- --host 127.0.0.1 --port 5175`.
2. From the Traffic repository start its demo backend: `node tests/support/mock-api-server.mjs`.
3. From Traffic's frontend directory start Vite against that backend: `VITE_PROD_URL=http://127.0.0.1:8787 npm run dev -- --host 127.0.0.1 --port 4173`.
4. From this portfolio repository run:

```sh
MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/capture-app-showcases.mjs
MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/render-app-showcases.mjs
```

For this session Traffic was run from an isolated copy in `/private/tmp/portfolio-traffic-showcase-app`, with a temporary Vite cache, to preserve its source checkout.

Raw recordings, timing manifests, and chapter screenshots go to `/private/tmp/app-showcases`. Override this with `APP_CAPTURE_DIR`; URLs can be overridden with `FOODNOTES_URL` and `TRAFFIC_URL`. `CAPTURE_APP`/`RENDER_APP` select `foodnotes` or `traffic`; `CAPTURE_FORMAT`/`APP_RENDER_FORMAT` select `desktop` or `mobile`.

Review every chapter and the loop seam, then update the renderer's date suffix and the references in `Hero.svelte` and `Projects.svelte` when publishing a future refresh. Changed app labels may require capture selector updates.
