# Creative and Technical References

These are **research links**. Do not copy protected artworks or shaders into the repository without verifying each item's license and attribution obligations.

## Shader craft
- [Shadertoy](https://www.shadertoy.com/) — explore volumetric raymarching, noise fields, particle effects, galactic compositions and lensing.
- [Three.js](https://threejs.org/) — rendering engine and custom ShaderMaterial / points.
- [Three.js Shadertoy adaptation guide](https://threejs.org/manual/#en/shadertoy) — translating fragment-shader idioms into an application pipeline.
- [The Book of Shaders](https://thebookofshaders.com/) — foundational procedural shader techniques.
- [Inigo Quilez articles](https://iquilezles.org/articles/) — technical study of signed distance, noise and raymarching; respect individual license terms.

## Artistic research topics
- High-quality kinetic typography and legibility through deformation.
- Fluid ink filament dynamics and curl-noise fields.
- Astronomical photography as inspiration for **density and light**, not as an asset to lift.
- Generative installations with sparse compositions and strong spatial rhythm.
- Subtle gravitational lensing and black-hole phenomena, only where appropriate to generated world.

## Original reference boards in this repo
- `references/visual-tone.svg` — palette, negative space, sparse particle composition.
- `references/transformation-storyboard.svg` — sequence and choreography.
- `references/exploration-composition.svg` — navigation and word rediscovery.

These boards are conceptual vector sketches made for GENESIS; they are **not** screenshots, Shadertoy derivatives, or proof of rendering quality.

## Research rule
Record source URL, creator, license, date checked, intended use and whether any code or assets were adapted before committing third-party material.

## Original rendering study

[Light between the stars](VOLUMETRIC_STUDY.md) contains original GLSL documentation code for bounded procedural density and emission/absorption integration, with an explicit particle-provenance and performance review contract. No external shader code or assets are incorporated in that study. General concepts such as ray integration, deterministic fields and scale-aware rendering are research directions; the code remains separate from the running prototype until independently integrated and visually reviewed.
