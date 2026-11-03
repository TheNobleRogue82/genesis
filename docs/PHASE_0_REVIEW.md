# Phase 0 — implementation and review

Initial browser prototype, reviewed November 3, 2026. This is an iteration baseline, not creative acceptance or a production release.

## Scope and reproduction

Vite, TypeScript and Three.js with original custom GLSL. Fixed phrase: **Everything is connected**. Canvas glyph sampling records source character and word IDs in persistent GPU attributes. One point cloud continuously deforms into three spiral arms, a concentrated core and a volumetric halo; a second draw call renders distant stars. Positions are evaluated in shaders, without per-particle CPU updates. The analytic swirling field is not a physical fluid solver or a curl-noise simulation.

Defaults: seed **731**, **48,000** particles on desktop / **20,000** on an initially narrow viewport, three arms, spread **0.85**, flow **1.4**, size **1.5**, duration **22 seconds**. Pixel ratio is capped at **1.7**; quality selection is manual, not an automatic frame-time controller. Background seed is **918**. Replay restores the origin camera at `(0, 0, 23)` and resets the animation time. The camera presets in `src/main.ts` are reproducible. System Georgia/serif is sampled; no web font or other external art asset is loaded. All shaders are original for this prototype. Three.js and development tools retain their package licenses.

From the checkout, run `npm ci`, `npm run dev -- --port 5173`, then `npm run review` in another terminal. Browser automation requires Chromium and uses SwiftShader for this cloud instance. Captures and video are generated locally and intentionally excluded from Git.

## Evidence

- `artifacts/origin.png` — progress 0
- `artifacts/filament.png` — progress 0.23
- `artifacts/release.png` — progress 0.43
- `artifacts/formation.png` — progress 0.67
- `artifacts/exploration.png` — progress 1
- `artifacts/rediscovery.png` — progress 1, discovery camera, settled reveal 1
- `artifacts/mobile-origin.png`, `artifacts/mobile-galaxy.png` — 390 × 844 responsive captures
- `artifacts/transition.webm` — actual canvas recording, 1440 × 1000, approximately 21.63 seconds; no UI or audio
- `artifacts/motion-contact-sheet.png` — video samples at four-second intervals
- `artifacts/review.json` — states, checks and captured metrics

Desktop review: **1440 × 1000**, DPR **1**, Chromium **155** on Linux. GPU is **ANGLE / Vulkan SwiftShader Device (Subzero)**, a software renderer. A settled 48k overview reported **26 FPS** / approximately **38 ms per frame**, with **two draw calls**. A separate 390 × 844 touch/keyboard run at 20k reported **51 FPS** / approximately **20 ms per frame**. These are short observations under browser automation, not worst-case benchmarks or physical mobile measurements. No 60 FPS hardware claim is made.

## Checks and iteration

Frozen-lockfile installation, TypeScript and production build pass. The production bundle is approximately 502 kB (128 kB gzip); Vite emits its chunk-size advisory. The browser run reports no JavaScript or shader errors. Real WebGL rendering and saved captures establish more than compilation alone.

Automated checks pass for six phase captures, mobile resizing, byte-identical origin canvas after replay, quality switching, mouse orbit, reduced-motion initial still, graphics-context loss messaging and real-time video export. Additional Chromium checks pass for emulated touch orbit, Space play/pause and a legible exact-phrase fallback with WebGL disabled. Actual phone touch, Safari, real GPU context restoration and sustained hardware performance have not been validated. Context loss currently requires reload.

Initial captures exposed early loss of legibility, noisy rediscovery and tight mobile framing. The next iteration delayed per-character activation from approximately progress 0.06 to 0.17, changed recognition from compressing all particles to reordering 30% of the original particles while the galaxy remains, and fitted mobile horizontal field of view. The six final captures were regenerated with the same seed and device settings. The final origin is legible on both reviewed viewport sizes; the final recognition is legible after settling. The motion contact sheet shows progressive material redistribution, but a full-speed human review of the WebM is still required to judge motion quality.

## Creative assessment and open work

| Criterion | Current evidence / limit |
| --- | --- |
| Exact phrase and provenance | Implemented through glyph samples, character/word attributes and stable point indices. |
| Composition and typography | Restrained void, cool silver/blue points, warm accents, serif origin; reviewed in desktop/mobile captures. Particle typography still has visible granular edges. |
| Continuous material transformation | Same geometry throughout; staged analytic flow, no scene substitution. Transition needs more directed filament shapes and velocity refinement. |
| Galaxy depth | Orbitable 3D disk plus halo; arm structure is still quite regular, with no dust occlusion or sophisticated light scattering. |
| Rediscovery | Same matter reforms with proximity and angle. Technically works; the full phrase is currently too explicit to call subtle discovery artistically accepted. |
| Interaction | Orbit/zoom, camera presets, scrub/pause/replay, frame/video capture and presentation mode implemented. A dedicated immersive fly-through is deferred. |
| Accessibility | Explicit playback, reduced-motion initial still, keyboard native controls and camera presets, canvas label, touch orbit, WebGL fallback and context-loss message. No autoplay microphone or audio. |
| Performance | Two draw calls, static GPU attributes and capped resolution. Actual device budgets and automatic adaptive resolution remain open. |

Three strongest qualities: negative space and restraint; genuine geometry continuity; reproducible, inspectable interaction. Three main flaws: regular spiral density, granular typography and overly explicit recognition. Next visual iteration should refine dust/arm density and intermediate filament pacing, test a word-level recognition approach, and measure actual desktop/mobile GPUs before creative sign-off. No microphone or AI integration was added.
