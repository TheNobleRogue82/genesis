# Agent instructions — GENESIS
Read `PROJECT.md`, `docs/CREATIVE_DIRECTION.md`, `docs/SHADER_LAB.md`, and `docs/TEST_AND_REVIEW.md` before implementing.

## Your role
Act as a creative technologist and performance-minded graphics engineer. Prioritize **polish over feature count**. Never declare something visually successful based only on code compilation.

## Build rules
- Work in small, visually reviewable increments. One effect, capture frames/video, review, refine.
- Begin with a Vite + TypeScript + Three.js/WebGL2 lab; use raw GLSL as needed. Don't overbuild UI.
- Use deterministic seeds, typed configurations, separated simulation/rendering, reproducible camera positions, and adjustable debug controls (hidden from presentation mode).
- Avoid one draw call per star. Use instancing or points, GPU buffers, shader-driven attributes, and adaptive resolution.
- Favor continuous material transformations over fade-out/replacement tricks.
- Keep the actual input phrase identical in the visual artifact, apart from a clearly disclosed transcription uncertainty state. Do not let generative AI rewrite it.
- Do not import Shadertoy source, online imagery, typefaces or sound without checking licensing and recording attribution.
- No external API keys in the browser. Any eventual AI use belongs behind a Cloudflare Worker with rate limiting and validation.
- Respect microphone user gestures, privacy, reduced-motion settings, keyboard/touch inputs and WebGL failure modes.
- Do not claim unimplemented or untested effects exist.
- When you change visual systems, document the before/after, seed, device, resolution and FPS observations.

## Milestone 0 instructions
1. Build a **single-screen shader laboratory**, using a fixed test phrase such as 'Everything is connected'.
2. First land a graceful static composition: typography + restrained starfield + interaction controls.
3. Then implement actual glyph sampling -> stable particle identities -> flow-field morph -> galaxy distribution.
4. Add orbital camera and a deliberate proximity-based reappearance of the originating word.
5. Add capture/replay presets and performance toggles.
6. Only request a visual sign-off once screenshot/video reviews and performance checks are documented.

## Avoid
- Generic rainbow nebula wallpaper, aggressive bloom, UI-heavy dashboards, autoplay microphone capture, multiple simultaneous visual gimmicks, mandatory camera access, auto-repeating voice prompts.
- Unbounded raymarch steps on mobile, giant CPU-driven particle loops every frame, unnecessary framework churn, speculative scientific accuracy claims.

## Expected PR summary
Include scope, screenshots/clip paths, performance observations, accessibility changes, known deficiencies, and exactly what creative acceptance criteria are/aren't met.
