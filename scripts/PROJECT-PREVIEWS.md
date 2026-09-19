# App-only project previews

The project cards use `foodnotes-project-preview-202609`, `traffic-project-preview-202609`, and `flex-project-preview-202609` MP4/JPEG pairs. These are new 1200 × 750 recordings, filling the cards' 16:10 frames without an information column. The existing hero phone videos are unchanged.

Each silent, 20.4-second loop has three fully loaded scenes, gentle 3.8-second eased scrolls where appropriate, brief holds, half-second dissolves, and a return to its opening image. Footage comes from actual local app interfaces and demo data. Navigation and loading happen outside the selected clips. The capture warms images/map tiles before filming and chooses foreground scrolling panels for dialogs.

Traffic's scrolling shots preserve screenshots of its fully rendered mini maps in the disposable capture page. This prevents the app's normal offscreen WebGL cleanup from showing tile reloads during the recording. The full map scene uses the live map renderer.

Scenes:

- FoodNotes: journal, meal nutrition details, nutrition insights.
- Traffic: incident cards, populated map, activity statistics.
- FLEX: routines, routine exercise preview, workout history.

`ProjectCard.svelte` shows the matching JPEG until the user hovers. The poster remains over the video until playback succeeds. Leaving stops and rewinds the clip, including when a pending load finishes afterward. Nearby videos may preload but never autoplay. Touch users tap to toggle; keyboard users activate the preview button with Enter/Space and stop with Escape or by leaving focus. Offscreen and hidden-tab videos stop.

## Refresh

Start the same local demo servers described in `APP-SHOWCASES.md` and `FLEX-SHOWCASE.md`. FLEX runs on 5173, FoodNotes on 5175, and Traffic on 4173 against its mock API on 8787. No signed-in browser profile or production writes are used.

```sh
MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/capture-project-previews.mjs
MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/render-project-previews.mjs
MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/check-project-previews.mjs
```

The tools reuse FLEX's installed Playwright, ffmpeg-static, and Sharp; Google Chrome is required. The regression check needs the portfolio running at `http://127.0.0.1:5176` (override with `PORTFOLIO_URL`). It checks idle posters, hover playback, leave/reset, rapid hover cancellation, keyboard activation, touch toggling, offscreen stopping, and slow media loads.

Set `CAPTURE_APP` or `RENDER_APP` to `foodnotes`, `traffic`, or `flex` to refresh one app. Override raw footage and review screenshot storage with `PROJECT_CAPTURE_DIR` (default `/private/tmp/project-previews`). Review all scenes and transition boundaries before updating the versioned filenames. Old videos remain available but are no longer used in project cards.
