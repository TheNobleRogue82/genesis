# GENESIS
**Speak, and let the universe begin.**

GENESIS is a browser-based, AI-directed interactive artwork where a visitor's **actual spoken words** become luminous typography, then matter, then a navigable universe. It is intended as a flagship creative-technology portfolio experience.

> **Status:** Phase 0 browser prototype implemented. Visual acceptance and real-device performance review remain open; this is not a production release.

## The non-negotiable experience
1. Enter a visually restrained void.
2. Deliberately press to record **one short utterance (target: 2–3 seconds)**. The microphone is never silently activated.
3. See the **actual transcribed words**, without AI paraphrasing, move as fluid, luminous letterforms.
4. Watch those letterforms physically transform into stars, dust, nebulae and galaxies.
5. Explore the resulting universe freely, from galaxy-scale inspection to immersive traversal.
6. Discover originating language subtly embedded in its cosmic structures.
7. Choose **Begin Again** to erase the current local universe and speak anew. 


## First objective: prove beauty
**Do not start with the AI backend.** Build **Genesis Shader Lab** first: one phrase -> animated typography -> continuous particle transformation -> convincing 3D galaxy -> interactive camera -> subtle rediscovery of letterforms. If this is merely a functional particle demo, the milestone has **not** passed.

## Project documents
- [PROJECT.md](PROJECT.md) — product vision, interaction and scope
- [AGENTS.md](AGENTS.md) — instructions for Codex and coding agents
- [docs/CREATIVE_DIRECTION.md](docs/CREATIVE_DIRECTION.md) — aesthetic and motion language
- [docs/EXPERIENCE.md](docs/EXPERIENCE.md) — interaction states and accessibility
- [docs/TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) — rendering, AI, hosting and privacy
- [docs/ROADMAP.md](docs/ROADMAP.md) — stages and acceptance gates
- [docs/SHADER_LAB.md](docs/SHADER_LAB.md) — first implementation brief
- [docs/TEST_AND_REVIEW.md](docs/TEST_AND_REVIEW.md) — visual and performance evaluation
- [docs/VOLUMETRIC_STUDY.md](docs/VOLUMETRIC_STUDY.md) — original GLSL study and next rendering experiment (not integrated)
- [docs/REFERENCES.md](docs/REFERENCES.md) — references, licensing and research
- [references/](references/) — original SVG conceptual reference boards, not final renders

## Run the Shader Lab

Requires Node.js 22.12+ (validated with Node.js 24.22.1).

```sh
npm ci
npm run dev -- --port 5173
```

Open the local Vite server on port 5173. Click **Release matter** for the 22-second transformation. Drag/touch to orbit, scroll/pinch to approach, and scrub the timeline to inspect any phase. **Space** toggles playback; **H** hides the interface; **Escape** restores it.

Open **Laboratory** for flow strength, starlight, 20k/48k particle quality, atmosphere off/on, mist light, dust absorption, volume quality and camera presets, PNG capture and WebM recording. The discovery camera approaches the original alignment; a subset of the same particles reorders into the phrase. Recording captures only the artwork, without interface or audio. Reduced-motion visitors start with a still and can scrub or explicitly play.

```sh
npm run build        # TypeScript and production bundle
npm run preview      # Serve the production bundle
npm run review       # Browser checks, screenshots and video; dev server must be running
```

The review script uses `/usr/bin/chromium` by default; override with `CHROMIUM_PATH`. It writes generated output to ignored `artifacts/`. Chromium software rendering is enabled for cloud validation; real-device GPU profiling is still required. See [Phase 0 review](docs/PHASE_0_REVIEW.md) for evidence, reproduction settings and limitations.

The optional atmosphere deposits density from the same moving particles, raymarches a reduced-resolution volume and attenuates stars to their depth. It starts off on narrow screens and detected software renderers; enable **Atmosphere → Volume · on** in Laboratory. Particle-only rendering remains available. Volume quality trades sample count and render resolution for detail. See the [volume iteration review](docs/VOLUME_ITERATION_REVIEW.md) for implementation limits and comparisons.

No microphone, AI backend, external imagery, downloaded fonts, accounts or API keys are used. Typography uses the browser's system Georgia/serif stack; glyph sampling can differ across operating systems.

## Principles
- **Visual artistry first.** Every frame should be worth examining.
- **One voice, one universe.** Creation is consequential.
- **Words are matter.** Preserve provenance from glyph sample to particle to cosmic landmark.
- **AI as an invisible creative force.** It interprets and composes, but does not replace the person's words.
- **Immediate feedback.** Rendering must never pause for model inference.
- **Performance, privacy, and accessibility are design requirements.**
