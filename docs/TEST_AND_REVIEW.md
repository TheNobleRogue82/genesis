# Visual QA and Acceptance Review

## Evaluation rubric (score each 1–5; 4+ target before milestone acceptance)
| Category | Questions |
| --- | --- |
| Composition | Is the scene compelling as a still? Is negative space purposeful? |
| Typography | Is original text beautiful, legible and unmistakably authentic? |
| Material continuity | Can the eye follow letters into matter without an obvious substitution? |
| Motion | Are speed, arcs, easing, turbulence and stillness elegantly controlled? |
| Spatial depth | Does the galaxy feel volumetric rather than like a flat decal? |
| Exploration | Are orbit, zoom and fly smooth, intuitive and non-nauseating? |
| Rediscovery | Do letterforms reveal themselves subtly, not as a cheesy overlay? |
| Performance | Are worst-case frames acceptable on targeted devices? |
| Accessibility | Reduced-motion, input, fallback and focus behavior tested? |
| AI necessity (later) | Does structured model-driven world creation meaningfully change result? |

## Required review artifacts
- 6 phase screenshots and a full-length real-time motion recording.
- Desktop and mobile viewport captures, with browser/device notes.
- Seed and configuration file to reproduce each capture.
- FPS/frame-time observations, draw calls/particle count and any trouble spots.
- Short critique: three strongest aesthetic qualities, three flaws, next iteration.

## Functional test cases
- Replay with same seed yields same world.
- Text matches test phrase exactly and remains traceable to particle origins.
- Browser resize/device pixel ratio does not break composition.
- Touch and mouse can navigate; camera prevents accidental clipping.
- GPU context loss/unavailable WebGL has a legible fallback.
- Reduced motion avoids aggressive camera animation.
- Later: no microphone until gesture, recording stops, no unwanted second capture, transcript failure does not invent speech, reset is deliberate.

## Quality policy
A working renderer is not necessarily a good experience. Document **what you can see** and **what you tested**, not what the code intends to accomplish.
