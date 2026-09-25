# Cinematic delivery

Runtime source of truth: `config/cinematic-assets.ts`. Five existing approved source films were encoded to H.264/yuv420p, CRF 21, slow preset, faststart, without audio. Hero remains 1920×1080; supporting films remain 1280×720. No approved imagery was regenerated. Five static WebP posters were extracted at one second.

Total film bytes: 19,420,531 → 6,606,407 (66% reduction). Files are served from this project's `/media/cinematic/` path with versioned filenames and immutable cache headers. Next/Image selects appropriately sized posters. A generation provider is no longer a runtime dependency. Retain source URLs, source/output hashes and per-file sizes in `cinematic-assets.json`; originals remain available at those source URLs, while the checked-in optimized files provide durable delivery.

## Behavior

- Server HTML has poster imagery and no video source URL attached.
- At hydration, reduced-motion and supported Save-Data preferences gate attachment. Eager hero may load immediately; other films load only near the viewport.
- Playback requires viewport intersection, a visible document and no manual pause. Scrolling away or hiding the tab pauses; returning resumes only if the user did not pause.
- The hero control pauses all cinematic films and signal paths. Reduced-motion mode is static; preference changes detach video sources.
- A playing event reveals video. Media errors or rejected autoplay leave the poster visible. A failed film is not retried endlessly.
- All films and supporting posters are decorative and cannot receive pointer/focus input. The hero caption and pause button remain above the media.
- The canonical GLB is retained as approved source material; the unreachable old loader has been removed from the homepage rather than fetching a second visual engine behind video.

## Asset update contract

Encode a new versioned filename only when replacing an asset, update the manifest and provenance together, verify playback/poster/error states and inspect quality. Do not overwrite a year-cached filename with new bytes. Do not add both eager preload links and competing video sources.

## Checks

`npm run validate && npm test && npm run lint && npm run build`

Pure policy boundaries are in `tests/cinematic-policy.test.ts`. Preview verification must also exercise real media requests, playback, user pause, section readability, links, narrow layouts and form interaction. Mocked provider tests do not constitute live delivery verification.
