# Genesis Shader Lab — Codex Implementation Brief

## Objective
Create the **first playable visual proof**, not the whole product: `Everything is connected` (test phrase) appears in a quiet void, becomes fluid luminous typography, releases a stable particle field, organizes into a 3D spiral galaxy, then invites free camera inspection. At a meaningful proximity/angle the galaxy subtly hints at the originating phrase.

## Required design experiments
### A. Legible origin
Use glyph outlines or a signed-distance texture to obtain particle spawn samples. Preserve character/word ID for every particle. Text is stable and beautifully typeset before motion begins. Show test phrase verbatim.

### B. Motion field
Use an elegant combination of staggered glyph activation, edge filamenting, curl noise/advection, and rotation toward a galactic structure. Support pause, scrub and replay. Prevent abrupt teleports.

### C. Cosmic structure
Use nonuniform distributions for core, spiral arms, halo and diffuse dust; vary color, luminosity, size and depth. The aesthetic should survive camera movement and still photography. Use bounded bloom and fine points, not large circular sprite blobs.

### D. Re-emergent language
Map word-associated particles to regions, then develop an angle-/proximity-dependent ordering or visual alignment that suggests letterforms. Do not simply slap a 2D text overlay onto the galaxy. Compare approaches and document whether they work artistically.

### E. Interaction
Mouse/touch orbit and zoom, gentle fly-through option, cinematic camera presets, unobtrusive reset/replay. Debug controls can be visible only in dev mode.

## Implementation ordering
1. Base Vite/TS/Three.js scene and deterministic seed.
2. Beautiful static type & galaxy compositions; inspect at multiple resolutions.
3. Particle topology and GPU shader pipeline.
4. Transformation with stable IDs and continuous motion.
5. Interactive camera and letter discovery.
6. Optimization, accessibility and final creative review.

## Engineering notes
- Particle positions and optional source/target targets should live in GPU buffers. Prefer minimal CPU work per frame.
- Fixed timestep or stable delta handling as required; pause when tab hidden.
- Parametric knobs: count, size, opacity, core radius, arms, turbulence, flow strength, bloom, exposure, reveal distance, scene scale, camera damping.
- Deterministic replay: seed, config and phrase fully define scene.
- Profile fill rate and raymarching, particularly on mobile.
- Do not copy unknown-license Shadertoy shader code.

## Art review deliverables
Capture frames at **origin**, **filament**, **release**, **formation**, **exploration** and **rediscovery**. Capture a full transition screen recording. Record viewport, GPU/browser when known, seed, FPS and known artifacts. Compare against `references/*.svg` only for composition and intent; those are sketches, not a target rendering quality.

## Stop condition
Do not advance to voice/AI integration unless Rich has approved the actual appearance and interactivity. If re-emergent typography looks gimmicky, experiment with restrained alternatives.

## Current rendering experiment: participating medium

Use the [original volumetric study](VOLUMETRIC_STUDY.md) as an implementation reference for irregular arm density, restrained core light and absorbing dust. The analytic example remains documentation code; the runtime now uses a GPU density atlas from the same word-derived particles. See [the volume iteration review](VOLUME_ITERATION_REVIEW.md) for checks and remaining limits. Keep the current word-derived particles, shared seed and timeline; avoid introducing an independent replacement galaxy. First compare medium-off/on at the same camera and exposure, then evaluate intermediate transformation states and device frame times before expanding navigation or visual scope.
