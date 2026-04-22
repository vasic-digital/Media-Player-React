# CLAUDE.md - Media-Player-React

## Overview

React media player for Catalogizer with entity-aware playback, supporting both video and audio via HTML5 media elements.

**Package**: `@vasic-digital/media-player`

## Build & Test

```bash
npm install
npm run build        # tsc
npm run test         # vitest run
npm run lint         # tsc --noEmit
npm run clean        # rm -rf dist
```

## Code Style

- TypeScript strict mode
- PascalCase components, camelCase functions/hooks
- Imports grouped: React, third-party, internal (`@vasic-digital/*`)
- Tests: Vitest with React Testing Library and jsdom environment
- All elements have `data-testid` attributes for testing

## Package Structure

| Path | Purpose |
|------|---------|
| `src/index.ts` | Re-exports all components, hooks, and types |
| `src/MediaPlayer.tsx` | Entity-aware player; renders `<video>` or `<audio>` based on media type |
| `src/PlayerControls.tsx` | Play/pause, seek bar, time display, mute, volume slider |
| `src/useMediaPlayer.ts` | Headless hook managing playback state and HTMLMediaElement ref |
| `src/__tests__/MediaPlayer.test.tsx` | MediaPlayer component tests |
| `src/__tests__/PlayerControls.test.tsx` | PlayerControls component tests |
| `src/__tests__/setup.ts` | Test setup (jsdom) |

## Key Exports

- `MediaPlayer` -- Main player component; accepts `entity` (MediaEntity) and `streamURL`. Auto-detects audio vs. video from `entity.media_type.name` (song/music_album -> `<audio>`, everything else -> `<video>`). Optional `autoPlay`, `onEnded`, `onError` callbacks
- `PlayerControls` -- Presentational control bar: play/pause toggle, current time / duration display (m:ss format), range-input seek bar, mute toggle, volume slider (0-1, step 0.05)
- `useMediaPlayer()` -- Headless hook returning `{ state, controls, ref }`. State: `isPlaying`, `isMuted`, `volume`, `currentTime`, `duration`, `isLoading`, `error`. Controls: `play()`, `pause()`, `toggle()`, `seek(time)`, `setVolume(vol)`, `mute()`, `unmute()`, `toggleMute()`
- Types: `MediaPlayerProps`, `PlayerControlsProps`, `MediaPlayerState`, `MediaPlayerControls`

## Dependencies

- **Peer**: `react ^18.0.0`
- **Internal**: `@vasic-digital/media-types` (MediaEntity)

## Design Patterns

- **Headless hook**: `useMediaPlayer` encapsulates all playback logic and HTMLMediaElement ref management; components consume state + controls without knowing DOM details
- **Entity-aware rendering**: MediaPlayer inspects `entity.media_type.name` to choose `<audio>` vs `<video>` element
- **Ref forwarding**: Hook returns a `RefObject<HTMLVideoElement>` that the component attaches to the media element
- **Composition**: MediaPlayer composes PlayerControls with shared state/controls from useMediaPlayer
- **Memoized callbacks**: All control functions use `useCallback` to prevent unnecessary re-renders

## Commit Style

Conventional Commits: `feat(media-player): description`


## ⚠️ MANDATORY: NO SUDO OR ROOT EXECUTION

**ALL operations MUST run at local user level ONLY.**

This is a PERMANENT and NON-NEGOTIABLE security constraint:

- **NEVER** use `sudo` in ANY command
- **NEVER** use `su` in ANY command
- **NEVER** execute operations as `root` user
- **NEVER** elevate privileges for file operations
- **ALL** infrastructure commands MUST use user-level container runtimes (rootless podman/docker)
- **ALL** file operations MUST be within user-accessible directories
- **ALL** service management MUST be done via user systemd or local process management
- **ALL** builds, tests, and deployments MUST run as the current user

### Container-Based Solutions
When a build or runtime environment requires system-level dependencies, use containers instead of elevation:

- **Use the `Containers` submodule** (`https://github.com/vasic-digital/Containers`) for containerized build and runtime environments
- **Add the `Containers` submodule as a Git dependency** and configure it for local use within the project
- **Build and run inside containers** to avoid any need for privilege escalation
- **Rootless Podman/Docker** is the preferred container runtime

### Why This Matters
- **Security**: Prevents accidental system-wide damage
- **Reproducibility**: User-level operations are portable across systems
- **Safety**: Limits blast radius of any issues
- **Best Practice**: Modern container workflows are rootless by design

### When You See SUDO
If any script or command suggests using `sudo` or `su`:
1. STOP immediately
2. Find a user-level alternative
3. Use rootless container runtimes
4. Use the `Containers` submodule for containerized builds
5. Modify commands to work within user permissions

**VIOLATION OF THIS CONSTRAINT IS STRICTLY PROHIBITED.**


