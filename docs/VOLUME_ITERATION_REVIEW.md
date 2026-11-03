# Volume iteration — particle-derived atmosphere

## Scope

An original experimental medium now follows the existing typography-to-galaxy particles. This iteration adds atmosphere off/on, mist light, dust absorption and three volume quality presets. No microphone, AI, external source code, imported shader assets or navigation expansion was added. This is not a creative acceptance claim.

Unlike a separate analytic spiral, density is deposited from the first **6,000** deterministic glyph-derived particles. Their origins, destinations, character IDs, word IDs and motion parameters come from the same geometry as the stars. A shared GLSL `particlePosition()` evaluates flow, staged activation, continuous transformation and recognition for both passes. GPU deposition avoids a CPU loop over particles each frame. Changing particle quality rebuilds the deposition geometry outside the animation loop.

## Pipeline and limits

- A **48³** density grid is stored as an **8 × 6** slice atlas, **384 × 288**, in a half-float render target. Each source particle deposits a small Gaussian into four nearby slices. Deposition is cached while the pose is unchanged.
- Density is sampled with bilinear XY and interpolated Z filtering. Tile-edge clipping prevents splats from leaking into unrelated slices. The field is limited to a world-space box of **±12**, with density capped at **3** to keep the core from becoming opaque.
- A reduced-resolution pass integrates emission and absorption along bounded camera rays. Presets are **16 samples at quarter resolution**, **24 at 0.35 resolution**, or **40 at half resolution**; the shader hard limit is 48. Seed, viewport and camera remain fixed during off/on comparisons.
- Each star integrates **eight** density samples from the volume entry to its own depth. This is an approximate depth-aware attenuation, rather than darkening every star by the total background opacity. Distant background stars are behind the medium; its composite applies total transmission there.
- The foreground stars and volume are composed into a linear half-float scene target, then converted for display once. There is no temporal accumulation or camera drift. Supported particle-only rendering retains this color pipeline, so it is not byte-identical to the original baseline's display output.
- The medium is exactly absent at the origin, rises continuously between timeline 0.18 and 0.7, and decreases during recognition. Scrubbing reverses both particle motion and density formation. The point identities are never replaced.
- On supported devices, paused volume views normally use **five draw calls**; moving density adds one. Particle-only rendering uses three, including the display conversion. Devices without float render-target support use the direct particle fallback. These counts replace the earlier two-call baseline for this pipeline.

Defaults: seed **731**, flow **1.4**, point size **1.5**, mist light **0.55**, dust **1**, light volume preset. The atmosphere starts off on initially narrow screens and detected software renderers, and is disabled when float render targets are unavailable. Enable it explicitly in Laboratory for comparison. Higher-resolution hardware remains unmeasured; default-on there does not establish a performance guarantee.

The grid is coarse. Small dust lanes may blur or band; eight transmission samples can miss thin foreground structures, and a capped density field is an artistic approximation. This implementation has no independent dust chemistry, multiple scattering, true black-body lighting or physically accurate galaxy model. Point sprites approximate transmission at their centers. World-space deposition assumes the particle object remains at its current identity transform. Density beyond the box is clipped. These limitations require review before increasing scene scale or adding immersive travel.

## Reproduction and artifacts

Run the development server in the cloud checkout with `npm run dev -- --port 5173`. In another terminal:

```sh
node scripts/volume-review.mjs
npm run review
node scripts/interaction-review.mjs
npm run build
```

Browser scripts use installed Chromium with software WebGL for this environment. They write generated captures under ignored `artifacts/`; no public preview or real-device test is implied. `volume-review.mjs` checks exact origin equality with atmosphere off/on, checks that zero emission and absorption is an identity operation, verifies absorption changes the image, and captures matched pairs at five timeline states plus camera and mobile views. `review.mjs` explicitly enables atmosphere for the six-phase captures and full transition recording.

Comparison artifacts are `artifacts/volume/{origin,filament,release,formation,exploration}-{off,on}.png`, `overview-on.png`, `edge-on.png`, `discovery-on.png`, `mobile-on.png`, `mobile-off.png` and `review.json`. The full regression run writes six phase captures and `artifacts/transition.webm` at the artifacts root. Capture configuration is recorded in each review JSON and in the defaults above.

## Visual iteration

The first half-resolution/24-sample attempt followed the matter, but dense absorption replaced the central sparkle with an opaque brown patch and ran poorly under software rendering. The next iteration capped density, reduced extinction, restored visible core stars, moved to a lighter preset and exposed mist brightness. Linear composition was added so volume/particle comparison uses one color pipeline. Final side-by-side frames must be assessed with those shared settings rather than compared as an exposure change against the old baseline.

Strongest qualities: the medium actually moves with the word-derived matter; warm central light and cool arm envelopes supply more spatial structure; origin typography and the particle-only path are retained. Open flaws: coarse cloud detail, approximate dust attenuation and high software-renderer cost. Recognition still reforms the phrase too explicitly; this iteration does not claim to solve that creative issue.

## Validation status

The original particle-only measurements in `PHASE_0_REVIEW.md` remain historical. Current capture metrics are reported below after the final run. Software results are not desktop-GPU or physical-mobile benchmarks. A real-device frame-time budget and full-speed human motion review remain required before creative acceptance.

Final validation: TypeScript/production build, volume comparison checks, six-phase browser review with video capture, deterministic origin replay, quality switching, mouse/touch orbit, keyboard play/pause, reduced-motion initial still, context-loss messaging and no-WebGL fallback pass. No JavaScript/shader errors were captured. The edge preset was corrected to `(0, -11.22, 18.92)`, perpendicular to the tilted disk normal, and captured separately after the suite.

At **1440 × 1000**, DPR **1**, Chromium **155 / ANGLE Vulkan SwiftShader**, a settled exploration view measured **16 FPS** (approximately **63 ms/frame**) with volume off, and **7 FPS** (approximately **143 ms/frame**) with light volume on. Formation measured 13/9 FPS off/on; the full review's overview observed 10 FPS. These are short automation observations, not worst-case benchmarks. A separate **390 × 844** / 20k particle-only interaction run observed **51 FPS**. The new volume-enabled canvas recording is approximately **21.47 seconds**, 1440 × 1000. The cloud software-renderer cost is a failed interactive-performance target for volume mode; opt-in and particle-only fallback are intentional. Physical-device GPU testing is unrun.

The paired images, edge/oblique/mobile views and phase captures were inspected. Warm core light remains visible, the envelope follows the forming arms, and origin off/on images are byte-identical. Density variation remains soft rather than richly filamented, so this is not a final dust-lane treatment. The exported video is provided for full-speed human motion review; no creative sign-off is requested from compilation or stills alone.
