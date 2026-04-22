# AGENTS.md - Media-Player-React Multi-Agent Coordination

## Module Identity

- **Package**: `@vasic-digital/media-player`
- **Role**: React media player with entity-aware playback for video and audio via HTML5 media elements
- **Peer Dependencies**: `react ^18.0.0`
- **Internal Dependencies**: `@vasic-digital/media-types`
- **TypeScript**: Strict mode

## Agent Responsibilities

### Media Player Agent

The Media Player agent owns the playback components and headless hook:

1. **MediaPlayer** (`src/MediaPlayer.tsx`) -- Main player component accepting `entity` (MediaEntity) and `streamURL`. Auto-detects audio vs. video from `entity.media_type.name` (song/music_album -> `<audio>`, everything else -> `<video>`). Supports `autoPlay`, `onEnded`, `onError` callbacks.

2. **PlayerControls** (`src/PlayerControls.tsx`) -- Presentational control bar: play/pause toggle, current time / duration display (m:ss format), range-input seek bar, mute toggle, volume slider (0-1, step 0.05).

3. **useMediaPlayer** (`src/useMediaPlayer.ts`) -- Headless hook encapsulating all playback logic and `HTMLMediaElement` ref management. Returns `{ state, controls, ref }`:
   - State: `isPlaying`, `isMuted`, `volume`, `currentTime`, `duration`, `isLoading`, `error`
   - Controls: `play()`, `pause()`, `toggle()`, `seek(time)`, `setVolume(vol)`, `mute()`, `unmute()`, `toggleMute()`

## Cross-Agent Coordination

### Upstream Dependencies

| Package | What Is Used | Coordinate When |
|---------|-------------|-----------------|
| `@vasic-digital/media-types` | `MediaEntity` | Entity interface or `media_type.name` value changes |

### Coordination Rules

- The audio/video detection logic relies on `entity.media_type.name` values (`song`, `music_album` -> audio). Adding new audio media types requires updating the detection logic here.
- `streamURL` is resolved externally (typically via `EntityService.getStreamURL()`). This component does not fetch URLs.
- `useMediaPlayer` hook is the single source of truth for playback state. Components must not manage playback state independently.

## File Map

```
Media-Player-React/
  src/
    index.ts                           -- Re-exports all components, hook, and types
    MediaPlayer.tsx                    -- Entity-aware video/audio player
    PlayerControls.tsx                 -- Playback control bar
    useMediaPlayer.ts                  -- Headless playback state hook
    __tests__/
      MediaPlayer.test.tsx             -- MediaPlayer component tests
      PlayerControls.test.tsx          -- PlayerControls component tests
      setup.ts                         -- Test setup (jsdom)
```

## Testing Standards

```bash
npm install
npm run build        # tsc
npm run test         # vitest run
npm run lint         # tsc --noEmit
```

Tests use Vitest with React Testing Library and jsdom environment. All elements have `data-testid` attributes.

## Conventions

- Headless hook pattern: `useMediaPlayer` encapsulates DOM interaction; components consume state + controls
- Entity-aware rendering: media type name determines `<audio>` vs `<video>` element
- Ref forwarding: hook returns `RefObject<HTMLVideoElement>` attached to the media element
- Composition: MediaPlayer composes PlayerControls with shared state/controls
- Memoized callbacks: all control functions use `useCallback` to prevent unnecessary re-renders

## Constraints

- **No CI/CD pipelines**: GitHub Actions, GitLab CI/CD, and all automated pipeline configurations are permanently disabled. All testing is local.
- **No data fetching**: Stream URLs are passed via props. URL resolution belongs in the host application.
- **HTML5 only**: No third-party player libraries (hls.js, video.js, etc.). Uses native `<video>` and `<audio>` elements.


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


