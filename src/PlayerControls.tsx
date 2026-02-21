import React from 'react'
import type { MediaPlayerState, MediaPlayerControls } from './useMediaPlayer'

export interface PlayerControlsProps {
  state: MediaPlayerState
  controls: MediaPlayerControls
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ state, controls }) => {
  return (
    <div data-testid="player-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: '#1a1a1a', color: '#fff' }}>
      <button
        data-testid="play-pause-btn"
        onClick={controls.toggle}
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2em' }}
      >
        {state.isPlaying ? '⏸' : '▶'}
      </button>

      <span data-testid="current-time">{formatTime(state.currentTime)}</span>
      <span>/</span>
      <span data-testid="duration">{formatTime(state.duration)}</span>

      <input
        data-testid="seek-bar"
        type="range"
        min={0}
        max={state.duration || 1}
        value={state.currentTime}
        onChange={(e) => controls.seek(Number(e.target.value))}
        style={{ flex: 1 }}
      />

      <button
        data-testid="mute-btn"
        onClick={controls.toggleMute}
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
      >
        {state.isMuted ? '🔇' : '🔊'}
      </button>

      <input
        data-testid="volume-slider"
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={state.isMuted ? 0 : state.volume}
        onChange={(e) => controls.setVolume(Number(e.target.value))}
        style={{ width: '80px' }}
      />
    </div>
  )
}
