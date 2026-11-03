# GENESIS — Product and Creative Brief
**Owner:** Rich Gue | **Destination:** RichGue.com | **Working title:** GENESIS  
**Tagline:** *Speak, and let the universe begin.*

## Thesis
A poetic interactive creation experience: the visitor contributes a few seconds of speech, sees their exact words become living typography and celestial matter, and explores a unique universe that follows from that utterance. No chat interface, avatar, or repeated prompting.

GENESIS is not a scientifically accurate planetarium, a game with levels, or a generative-video player. It is an expressive, responsive, explorable artwork, with a technically honest frontier-model layer that provides structural creativity.

## Audience and portfolio outcome
A visitor should first feel awe, then agency, then curiosity. A reviewer should be able to identify the unusual interaction idea, the quality of execution, the role of frontier models, and the engineering discipline. An optional, nonintrusive **Intelligence Layer** can explain which outputs are AI-directed, simulated or rendered; never display it by default.

## Locked decisions
- Text shown during creation is the **recognized version of the visitor's actual speech**; never swap it for AI-authored poetry.
- User-initiated microphone interaction only. Approximately 2–3 seconds; stop on release or cap automatically. Consider a brief voice-onset grace period after consent to avoid capturing silence as the whole attempt; test before fixing behavior.
- Only one recording per creation. Reset is the sole path to a new universe.
- No camera or image-based avatar.
- No chatbot, no forced narrative, no automatic end, no prescribed exploration time.
- Smooth transition between overview-scale and immersive navigation.
- Browser-first execution, Cloudflare-compatible deployment.
- Original visual treatment, with Shadertoy as a technical reference rather than a library of reusable unlicensed code.

## North-star experience
**Void → intentional utterance → visible true words → fluid typography → coherent particle transformation → celestial formation → free exploration → rediscovered words → optional rebirth.**

### What makes this novel
The words are not a loading screen for a generated texture. Their geometrical samples are linked to the matter forming the universe. Reversibility and provenance mean a visitor can recognize their own phrase in a galaxy's structure during exploration. AI designs the system, its mood, landmarks and discoverable relationships, while the browser's deterministic rendering machinery makes it responsive.

## Priorities in order
1. Artistic beauty and timing.
2. Tactile, responsive interaction.
3. Coherence between typography and cosmic structure.
4. Smooth navigation on real hardware.
5. Frontier AI relevance and demonstrability.
6. Persistence/shareability, only once core experience works.

## Explicit non-goals for Shader Lab
Real microphone recording, AI API access, user accounts, R2/D1 storage, photorealistic full-universe simulation, multiplayer, avatars, tutorials and monetization.

## Success definition
A convincing sequence that is compelling without audio, without a chatbot, and without explaining how it works; camera motion feels intentional; transition preserves material continuity; mobile fallback is dignified; reviewers can replay and examine a deterministic seed.

See [ROADMAP](docs/ROADMAP.md) for acceptance gates.
