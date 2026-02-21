# Architecture — @vasic-digital/media-player

## Overview

Entity-aware React media player using HTML5 `<video>` and `<audio>` elements. Detects media type to render the correct element and provides a `useMediaPlayer` hook for custom player UIs.

## Design Patterns

- **Strategy**: Media element selection (video vs audio) is a strategy based on `entity.media_type.name`
- **Facade**: `MediaPlayer` hides `useMediaPlayer` hook complexity behind a simple prop interface
- **Hook Pattern**: `useMediaPlayer` encapsulates all player state and refs, enabling headless usage

## Hook Interface

```
useMediaPlayer()
  → state: MediaPlayerState   (isPlaying, volume, currentTime, duration, ...)
  → controls: MediaPlayerControls (play, pause, seek, setVolume, mute, ...)
  → ref: RefObject<HTMLVideoElement>
```
