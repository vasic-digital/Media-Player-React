import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerControls } from '../PlayerControls'
import type { MediaPlayerState, MediaPlayerControls } from '../useMediaPlayer'

function makeState(overrides: Partial<MediaPlayerState> = {}): MediaPlayerState {
  return {
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 120,
    isLoading: false,
    error: null,
    ...overrides,
  }
}

function makeControls(overrides: Partial<MediaPlayerControls> = {}): MediaPlayerControls {
  return {
    play: vi.fn(),
    pause: vi.fn(),
    toggle: vi.fn(),
    seek: vi.fn(),
    setVolume: vi.fn(),
    mute: vi.fn(),
    unmute: vi.fn(),
    toggleMute: vi.fn(),
    ...overrides,
  }
}

describe('PlayerControls', () => {
  it('renders play button when paused', () => {
    render(<PlayerControls state={makeState({ isPlaying: false })} controls={makeControls()} />)
    expect(screen.getByTestId('play-pause-btn')).toHaveTextContent('▶')
  })

  it('renders pause button when playing', () => {
    render(<PlayerControls state={makeState({ isPlaying: true })} controls={makeControls()} />)
    expect(screen.getByTestId('play-pause-btn')).toHaveTextContent('⏸')
  })

  it('calls toggle when play/pause clicked', () => {
    const controls = makeControls()
    render(<PlayerControls state={makeState()} controls={controls} />)
    fireEvent.click(screen.getByTestId('play-pause-btn'))
    expect(controls.toggle).toHaveBeenCalled()
  })

  it('shows muted icon when muted', () => {
    render(<PlayerControls state={makeState({ isMuted: true })} controls={makeControls()} />)
    expect(screen.getByTestId('mute-btn')).toHaveTextContent('🔇')
  })

  it('calls toggleMute when mute button clicked', () => {
    const controls = makeControls()
    render(<PlayerControls state={makeState()} controls={controls} />)
    fireEvent.click(screen.getByTestId('mute-btn'))
    expect(controls.toggleMute).toHaveBeenCalled()
  })

  it('displays formatted time', () => {
    render(<PlayerControls state={makeState({ currentTime: 65, duration: 185 })} controls={makeControls()} />)
    expect(screen.getByTestId('current-time')).toHaveTextContent('1:05')
    expect(screen.getByTestId('duration')).toHaveTextContent('3:05')
  })

  it('renders seek bar and volume slider', () => {
    render(<PlayerControls state={makeState()} controls={makeControls()} />)
    expect(screen.getByTestId('seek-bar')).toBeTruthy()
    expect(screen.getByTestId('volume-slider')).toBeTruthy()
  })
})
