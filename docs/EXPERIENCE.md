# Experience and Interaction Specification

## Primary journey
**Void** — Initial visual composition and CTA: “Speak, and let the universe begin.” No camera or microphone active. Provide a secondary accessible explanation and skip-to-demo option.

**Consent and capture** — Button press deliberately requests microphone access. Record only during the explicit interaction, subject to a hard ~3s cap; release stops earlier. Immediately end and release tracks. Provide a visible recording indicator and clear permission/error states. Audio-reactive visual feedback may begin before transcript arrives.

**Transcript reveal** — Display recognized speech exactly, without AI rewriting. Because recognition can err, final UX must acknowledge uncertainty; consider a brief, optional correction/confirmation step that does not count as another recording. If the audio is silent or unintelligible, offer non-audio demo or reset rather than fabricate words.

**Genesis** — Words become fluid filaments and then cosmic matter. This sequence must be cinematic while remaining skippable for reduced-motion or accessibility.

**Explore** — Free orbit, pan, zoom, fly-in and fly-out as appropriate. Desktop mouse/keyboard and mobile touch must both work; accessible alternate controls for key motion. No time limit, no forced tour, no microphone reactivation.

**Recognition** — At suitable view geometry, cosmic structure subtly exposes letter-origin patterns. Discovery should feel earned, not an intrusive label.

**Begin Again** — Deliberate reset clears current world state and returns to void, ready for a new one-off recording. Confirm only if there is valuable unsaved data.

## Interaction states
`idle → permission_request → recording → transcription → forming → exploring → reset → idle`
Explicit branches: `permission_denied`, `silent_audio`, `transcription_failure`, `render_fallback`, `ai_timeout`. No invisible microphone retries.

## Design tensions to test
- Does 2–3 seconds feel expressive or stressful? User's constraint stands; test voice-onset handling and indicators.
- Recording-on-press vs press-and-hold: prototype both on desktop and mobile; do not imply a recording has begun before browser permission succeeds.
- Transcript confirmation offers accuracy but may puncture the magic. Test an unobtrusive mechanism.
- First-run onboarding should be minimal, with visible consent and accessible fallback.

## Accessibility and privacy
- Capture only after user action; microphone indicator is mandatory.
- Do not retain raw audio by default. Explain external transcription processing before capture, and specify retention/processor behavior accurately at launch.
- Provide no-mic exploration demo, keyboard/touch navigation, captions/text of transcript, focus indicators and reduced-motion behavior.
- For Cloudflare deployment use HTTPS; never expose API keys.
