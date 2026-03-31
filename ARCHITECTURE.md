# Architecture -- Media-Player-React

## Purpose

React media player for Catalogizer with entity-aware playback. Provides HTML5 video/audio player with automatic media type detection, a headless playback hook, and composable player controls.

## Structure

```
src/
  index.ts                   Re-exports all components, hooks, and types
  MediaPlayer.tsx            Entity-aware player; renders <video> or <audio> based on media type
  PlayerControls.tsx         Play/pause, seek bar, time display, mute, volume slider
  useMediaPlayer.ts          Headless hook managing playback state and HTMLMediaElement ref
  __tests__/
    MediaPlayer.test.tsx     Component tests
    PlayerControls.test.tsx  Controls tests
    setup.ts                 Test setup (jsdom)
```

## Key Components

- **`MediaPlayer`** -- Main component accepting entity and streamURL. Auto-detects audio vs. video from entity.media_type.name (song/music_album -> `<audio>`, everything else -> `<video>`)
- **`PlayerControls`** -- Presentational: play/pause toggle, current time/duration (m:ss format), range-input seek bar, mute toggle, volume slider
- **`useMediaPlayer()`** -- Headless hook returning state (isPlaying, isMuted, volume, currentTime, duration, isLoading, error) and controls (play, pause, toggle, seek, setVolume, mute, unmute, toggleMute)

## Data Flow

```
MediaPlayer(entity, streamURL)
    |
    useMediaPlayer() -> ref attached to <video> or <audio> element
        |
        state: { isPlaying, currentTime, duration, volume, ... }
        controls: { play(), pause(), seek(time), setVolume(vol), ... }
        |
    PlayerControls(state, controls) -> render UI controls
```

## Dependencies

- React 18+ (peer)
- `@vasic-digital/media-types` -- MediaEntity

## Testing Strategy

Vitest with React Testing Library and jsdom. Tests cover audio vs. video element selection based on media type, control rendering, play/pause toggle, volume adjustment, and seek bar interaction.
