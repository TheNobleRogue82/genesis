# GENESIS
**Speak, and let the universe begin.**

GENESIS is a browser-based, AI-directed interactive artwork where a visitor's **actual spoken words** become luminous typography, then matter, then a navigable universe. It is intended as a flagship creative-technology portfolio experience.

> **Status:** Creative direction and implementation plan. No production implementation yet.

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
- [docs/REFERENCES.md](docs/REFERENCES.md) — references, licensing and research
- [references/](references/) — original SVG conceptual reference boards, not final renders

## Suggested local setup
Repository: `https://github.com/TheNobleRogue82/genesis`

The initial Codex task is to create a Vite + TypeScript + Three.js shader lab, **after** reading `AGENTS.md`, `docs/SHADER_LAB.md`, and `docs/CREATIVE_DIRECTION.md`. Prefer custom shaders and a lightweight rendering core; add React only if there is a justified UI need.

## Principles
- **Visual artistry first.** Every frame should be worth examining.
- **One voice, one universe.** Creation is consequential.
- **Words are matter.** Preserve provenance from glyph sample to particle to cosmic landmark.
- **AI as an invisible creative force.** It interprets and composes, but does not replace the person's words.
- **Immediate feedback.** Rendering must never pause for model inference.
- **Performance, privacy, and accessibility are design requirements.**
