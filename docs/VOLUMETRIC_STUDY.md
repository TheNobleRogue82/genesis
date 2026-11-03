# Original study: light between the stars

**Status:** the analytic shader below remains a standalone documentation reference. The runtime now implements a related particle-deposited medium; see [the iteration review](VOLUME_ITERATION_REVIEW.md). This study was written for GENESIS using general procedural rendering and light-transport principles. No external shader source or assets are included or adapted.

## Purpose

Keep the existing word-derived particles as the visible, traceable matter. Add a quiet participating medium to connect their spiral arms: irregular luminous filaments, darker dust lanes, a warm central concentration and cooler outer light. Empty space must remain dominant. This is an expressive model, not an astronomical simulation.

The next experiment should compare particle-only rendering with particles plus a low-density medium at identical seed, timeline, camera, exposure and viewport. It must improve depth while orbiting and preserve the origin phrase's legibility. A fog overlay or a bright replacement galaxy does not satisfy continuity.

## A small original GLSL reference

This self-contained GLSL ES 3.00 fragment shader demonstrates a bounded volume, smooth deterministic density variation and front-to-back emission/absorption integration. It uses a cylindrical arm pattern with radius-dependent phase, not a stored texture. The trigonometric field is deliberately inexpensive and will show repetition; it is a baseline for experiments, not a finished noise implementation or production shader.

Rays and density are evaluated in **galaxy-local coordinates**: XZ is the disk, Y is its thickness. Supply inverse projection, camera world and inverse galaxy world matrices from the same camera/galaxy transforms used by the particle renderer. The matrices must include the disk's tilt. `uPhase` is a fixed three-component phase derived once from the scene seed, not from wall-clock time. `uMatter` is a formation envelope supplied by the shared timeline. Values below are initial experiment settings, not measured performance budgets.

```glsl
#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uViewport;
uniform mat4 uInverseProjection;
uniform mat4 uCameraWorld;
uniform mat4 uGalaxyWorldInverse;
uniform vec3 uPhase;
uniform float uMatter;       // 0 at origin, continuous rise during formation
uniform float uExtinction;   // start at 0.6; nonnegative, in inverse scene units
uniform float uEmission;     // start at 0.7; linear radiance scale
uniform int uSteps;          // try 16, 24, 40; hard maximum is 48

const float BOUND = 10.0;

float structure(vec3 p) {
    // Smooth, bounded variation with fixed seed phases; no texture dependency.
    float a = sin(dot(p, vec3(0.73, 1.31, -0.46)) + uPhase.x);
    float b = cos(dot(p, vec3(-1.61, 0.57, 1.09)) + uPhase.y);
    float c = sin(dot(p, vec3(2.17, -1.43, 0.83)) + uPhase.z);
    return clamp(0.5 + 0.22*a + 0.17*b + 0.11*c, 0.0, 1.0);
}

vec2 medium(vec3 p) {
    float radius = length(p.xz);
    // Avoid undefined atan(0, 0); the core does not need an angular coordinate.
    float angle = radius > 0.0001 ? atan(p.z, p.x) : 0.0;
    float width = 0.13 + 0.035*radius;
    float disk = exp(-0.5*p.y*p.y/(width*width));
    float variation = structure(p*1.7);
    float phase = 3.0*angle - 1.89*radius + 0.65*(variation-0.5);
    float arm = pow(0.5 + 0.5*cos(phase), 7.0);
    float edge = 1.0 - smoothstep(6.8, 9.2, radius);
    float bulge = exp(-dot(p, p)/0.7);
    float matter = clamp(uMatter, 0.0, 1.0);
    float luminous = matter*edge*(disk*arm*(0.08 + 0.18*variation)
                                  + 0.32*bulge);
    // Dust is displaced relative to the arm ridge and adds absorption only.
    float lane = pow(0.5 + 0.5*cos(phase + 0.55), 14.0);
    float dust = matter*edge*disk*lane*(0.04 + 0.12*variation);
    return vec2(luminous, dust);
}

vec4 integrateMedium(vec3 origin, vec3 direction) {
    // Clip to a sphere before marching; also handles a camera inside the bound.
    float b = dot(origin, direction);
    float discriminant = b*b - dot(origin, origin) + BOUND*BOUND;
    if (discriminant <= 0.0) return vec4(0.0);
    float root = sqrt(discriminant);
    float nearT = max(0.0, -b-root);
    float farT = -b+root;
    if (farT <= nearT) return vec4(0.0);

    int count = clamp(uSteps, 1, 48);
    float ds = (farT-nearT)/float(count);
    float transmission = 1.0;
    vec3 radiance = vec3(0.0);
    for (int i=0; i<48; ++i) {
        if (i >= count || transmission < 0.01) break;
        vec3 p = origin + direction*(nearT + (float(i)+0.5)*ds);
        vec2 density = medium(p);
        float extinction = max(uExtinction, 0.0)*(density.x + density.y);
        float attenuation = exp(-extinction*ds);
        float weight = extinction > 0.00001
            ? (1.0-attenuation)/extinction : ds;
        vec3 tint = mix(vec3(1.0, 0.72, 0.42), vec3(0.43, 0.64, 0.95),
                        smoothstep(0.5, 5.5, length(p.xz)));
        vec3 emission = tint*density.x*max(uEmission, 0.0);
        radiance += transmission*emission*weight;
        transmission *= attenuation;
    }
    return vec4(radiance, 1.0-transmission);
}

void main() {
    vec2 ndc = gl_FragCoord.xy/uViewport*2.0-1.0;
    vec4 eye = uInverseProjection*vec4(ndc, -1.0, 1.0);
    vec3 worldDirection = mat3(uCameraWorld)*normalize(eye.xyz/eye.w);
    vec3 origin = (uGalaxyWorldInverse*uCameraWorld*vec4(0.0,0.0,0.0,1.0)).xyz;
    vec3 direction = normalize(mat3(uGalaxyWorldInverse)*worldDirection);
    outColor = integrateMedium(origin, direction);
}
```

This assumes a perspective camera, a rigid galaxy transform and scene-unit density. Nonuniform scale requires corrected ray distances and extinction units. `uViewport` must match the render target's physical pixel size, including any reduced-resolution pass. Render into a linear color buffer and apply exposure/tone mapping once after composition. The output stores integrated radiance in RGB and opacity in A; it is intended for explicit composition, not conventional straight-alpha blending. Basic background composition is `radiance + transmission * background`, where `transmission = 1 - alpha`.

## Integration contract

1. Share seed, arm count, radial pitch, disk orientation and timeline with the particle configuration. The reference fixes three arms and pitch 1.89 to match the current three-arm particle baseline; expose shared parameters before integrating it. The medium must follow the particle distribution, not introduce an unrelated galaxy.
2. Drive `uMatter` continuously from the existing formation timeline and reverse it when scrubbing. Keep it exactly zero at origin. Do not fade out the original particles or substitute a new scene. A scalar formation envelope alone does **not** make this sample follow the intermediate filaments: that needs a shared deformation field or density derived from their trajectories.
3. Preserve particle IDs and character/word associations. Medium density is supplemental; this analytic field has no glyph provenance of its own. For stronger continuity, investigate depositing density from the same word-associated samples or applying their deformation to the density field.
4. Composite in linear space. Stars behind dust should be attenuated, while foreground stars remain clear. A single total-transmission image cannot resolve interleaved stars and dust: use depth-aware integration/splitting, or evaluate transmission to each relevant depth. Do not simply put the whole volume on top of the star layer and call it correct occlusion.
5. Begin with a half-resolution volume target and the particle pass at full resolution. Compare 16/24/40 samples, viewing angles and quality-off mode. These are candidate settings; thin dust lanes may be undersampled, and half-resolution upsampling can erase them or create halos. Avoid temporal accumulation until deterministic replay, motion and disocclusion behavior are tested.
6. Retain a particle-only fallback, reduced-motion still/scrub behavior, hidden-tab pause and bounded work. Keep camera drift off by default. Coordinate rebasing and scale-dependent detail belong to a later navigation experiment, not this first density pass.

## Review gate

Capture origin, filament, release, formation, exploration and discovery with seed 731, plus oblique and edge-on views. Record desktop/mobile viewport, renderer, pixel ratio, count, sample budget, exposure and frame times. Compare medium-off/on with the same settings. Inspect a full-speed recording for shimmer, stepping and sudden material changes; still images cannot establish motion quality.

Accept this experiment only if dust creates depth without hiding authentic text, the medium follows the transforming matter, rediscovery remains spatial rather than an overlay, and measured device performance meets the selected budget. Test reduced motion and the particle-only fallback. The current prototype's review remains the baseline; no visual or performance result is claimed for this documentation study.

## Code validation

The shader block compiled and linked in Chromium 155 / WebGL2 with SwiftShader. A 32 × 32 smoke render produced zero RGBA output at `uMatter = 0` and nonzero output at `uMatter = 1` for 16, 24 and 40 samples, without GL errors. This checks basic execution only: it does not establish artistic quality, correct composition with particles, cross-device performance or integration into the app.

## Runtime implementation

`src/volume.ts` follows the emission/absorption principles above but replaces the analytic galaxy field with a GPU density atlas deposited from 6,000 actual glyph-derived particles. Both deposition and the stars call the same `particlePosition()` function, including intermediate motion, flow and rediscovery. This gives the volume shared provenance and deformation rather than an independent galaxy shape. Particle transmission is sampled to each star's depth. Density is coarse and undersampled, so this is still a visual experiment, not exact radiative transfer.
