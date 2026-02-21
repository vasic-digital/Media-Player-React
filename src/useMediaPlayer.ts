import { useState, useRef, useCallback } from 'react'

export interface MediaPlayerState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTime: number
  duration: number
  isLoading: boolean
  error: string | null
}

export interface MediaPlayerControls {
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  toggleMute: () => void
}

export function useMediaPlayer(): { state: MediaPlayerState; controls: MediaPlayerControls; ref: React.RefObject<HTMLVideoElement | null> } {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<MediaPlayerState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  })

  const play = useCallback(() => {
    ref.current?.play()
    setState((s) => ({ ...s, isPlaying: true }))
  }, [])

  const pause = useCallback(() => {
    ref.current?.pause()
    setState((s) => ({ ...s, isPlaying: false }))
  }, [])

  const toggle = useCallback(() => {
    if (state.isPlaying) pause()
    else play()
  }, [state.isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (ref.current) {
      ref.current.currentTime = time
      setState((s) => ({ ...s, currentTime: time }))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (ref.current) {
      ref.current.volume = volume
    }
    setState((s) => ({ ...s, volume }))
  }, [])

  const mute = useCallback(() => {
    if (ref.current) ref.current.muted = true
    setState((s) => ({ ...s, isMuted: true }))
  }, [])

  const unmute = useCallback(() => {
    if (ref.current) ref.current.muted = false
    setState((s) => ({ ...s, isMuted: false }))
  }, [])

  const toggleMute = useCallback(() => {
    if (state.isMuted) unmute()
    else mute()
  }, [state.isMuted, mute, unmute])

  return { state, controls: { play, pause, toggle, seek, setVolume, mute, unmute, toggleMute }, ref }
}
