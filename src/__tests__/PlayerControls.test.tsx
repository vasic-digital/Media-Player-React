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

  it('shows unmuted icon when not muted', () => {
    render(<PlayerControls state={makeState({ isMuted: false })} controls={makeControls()} />)
    expect(screen.getByTestId('mute-btn')).toHaveTextContent('🔊')
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

  it('calls seek when seek bar is changed', () => {
    const controls = makeControls()
    render(<PlayerControls state={makeState({ duration: 300 })} controls={controls} />)
    fireEvent.change(screen.getByTestId('seek-bar'), { target: { value: '150' } })
    expect(controls.seek).toHaveBeenCalledWith(150)
  })

  it('calls setVolume when volume slider is changed', () => {
    const controls = makeControls()
    render(<PlayerControls state={makeState()} controls={controls} />)
    fireEvent.change(screen.getByTestId('volume-slider'), { target: { value: '0.5' } })
    expect(controls.setVolume).toHaveBeenCalledWith(0.5)
  })

  it('displays volume slider at 0 when muted', () => {
    render(<PlayerControls state={makeState({ isMuted: true, volume: 0.8 })} controls={makeControls()} />)
    const slider = screen.getByTestId('volume-slider') as HTMLInputElement
    expect(slider.value).toBe('0')
  })

  it('displays volume slider at current volume when not muted', () => {
    render(<PlayerControls state={makeState({ isMuted: false, volume: 0.75 })} controls={makeControls()} />)
    const slider = screen.getByTestId('volume-slider') as HTMLInputElement
    expect(slider.value).toBe('0.75')
  })

  it('formats zero time correctly', () => {
    render(<PlayerControls state={makeState({ currentTime: 0, duration: 0 })} controls={makeControls()} />)
    expect(screen.getByTestId('current-time')).toHaveTextContent('0:00')
    expect(screen.getByTestId('duration')).toHaveTextContent('0:00')
  })

  it('formats time over one hour correctly', () => {
    render(<PlayerControls state={makeState({ currentTime: 3661, duration: 7200 })} controls={makeControls()} />)
    expect(screen.getByTestId('current-time')).toHaveTextContent('61:01')
    expect(screen.getByTestId('duration')).toHaveTextContent('120:00')
  })

  it('seek bar max equals duration', () => {
    render(<PlayerControls state={makeState({ duration: 250 })} controls={makeControls()} />)
    const seekBar = screen.getByTestId('seek-bar') as HTMLInputElement
    expect(seekBar.max).toBe('250')
  })

  it('seek bar max defaults to 1 when duration is 0', () => {
    render(<PlayerControls state={makeState({ duration: 0 })} controls={makeControls()} />)
    const seekBar = screen.getByTestId('seek-bar') as HTMLInputElement
    expect(seekBar.max).toBe('1')
  })

  it('seek bar value reflects currentTime', () => {
    render(<PlayerControls state={makeState({ currentTime: 45 })} controls={makeControls()} />)
    const seekBar = screen.getByTestId('seek-bar') as HTMLInputElement
    expect(seekBar.value).toBe('45')
  })

  it('volume slider min is 0 and max is 1', () => {
    render(<PlayerControls state={makeState()} controls={makeControls()} />)
    const slider = screen.getByTestId('volume-slider') as HTMLInputElement
    expect(slider.min).toBe('0')
    expect(slider.max).toBe('1')
  })

  it('volume slider step is 0.05', () => {
    render(<PlayerControls state={makeState()} controls={makeControls()} />)
    const slider = screen.getByTestId('volume-slider') as HTMLInputElement
    expect(slider.step).toBe('0.05')
  })
})
