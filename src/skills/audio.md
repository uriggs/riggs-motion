# Audio and Sound Design

Use this skill whenever a prompt asks for voiceover, narration, music, sound effects, ticks, pulses, impacts, whooshes, beats, or audio-synchronized motion.

## Available APIs

```tsx
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
```

## Asset locations

Local media assets live under `public/` and must be referenced with `staticFile()`.

Recommended folders:

- `public/audio/` for sound effects such as ticks, pulses, impacts, and whooshes
- `public/voiceover/` for narration tracks
- `public/music/` for music beds

Examples:

```tsx
<Audio src={staticFile("audio/tick-soft.wav")} volume={0.4} />
<Audio src={staticFile("voiceover/narration.mp3")} volume={1} />
<Audio src={staticFile("music/bed.mp3")} volume={0.14} />
```

Only reference files that are explicitly stated to exist. Do not invent audio filenames.

## Timing sound effects

Use `<Sequence>` to place a sound at an exact frame. Prefer timing that reinforces the visual motion.

```tsx
<Sequence from={18} durationInFrames={12}>
  <Audio src={staticFile("audio/tick-soft.wav")} volume={0.45} />
</Sequence>
```

Use `fps` from `useVideoConfig()` when converting seconds to frames.

## Layering

Multiple `<Audio>` elements may be layered in one composition:

- Voiceover: usually the dominant track
- Music bed: keep low enough that narration remains clear
- Sound effects: short, intentional accents tied to visual events

As a starting point, voiceover can sit near `1`, music around `0.10-0.20`, and short sound effects around `0.30-0.60`, then refine by ear.

## Sound-design principles

- Sound should reinforce meaning and rhythm, not decorate every frame.
- Sync ticks, pulses, impacts, and whooshes to actual motion events.
- Use quieter accents for setup and stronger impacts for payoff moments.
- Leave intentional silence where it increases contrast.
- Avoid stacking too many effects at once.
- For premium brand work, favor restrained, clean, cinematic sound design over exaggerated or cartoon-like effects.

## Voiceover synchronization

When a voiceover file exists, structure major scene changes around the spoken phrasing. Use exact frame timing when timestamps are known. If no timestamps are supplied, create reasonable scene timing but do not claim word-level sync.
