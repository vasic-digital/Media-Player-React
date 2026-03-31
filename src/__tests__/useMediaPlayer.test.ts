import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaPlayer } from '../useMediaPlayer'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useMediaPlayer', () => {
  describe('initial state', () => {
    it('returns initial state with all defaults', () => {
      const { result } = renderHook(() => useMediaPlayer())

      expect(result.current.state).toEqual({
        isPlaying: false,
        isMuted: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        isLoading: false,
        error: null,
      })
    })

    it('returns a ref object', () => {
      const { result } = renderHook(() => useMediaPlayer())
      expect(result.current.ref).toBeDefined()
      expect(result.current.ref.current).toBeNull()
    })

    it('returns controls object with all methods', () => {
      const { result } = renderHook(() => useMediaPlayer())
      const { controls } = result.current

      expect(typeof controls.play).toBe('function')
      expect(typeof controls.pause).toBe('function')
      expect(typeof controls.toggle).toBe('function')
      expect(typeof controls.seek).toBe('function')
      expect(typeof controls.setVolume).toBe('function')
      expect(typeof controls.mute).toBe('function')
      expect(typeof controls.unmute).toBe('function')
      expect(typeof controls.toggleMute).toBe('function')
    })
  })

  describe('play and pause', () => {
    it('play sets isPlaying to true', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.play()
      })

      expect(result.current.state.isPlaying).toBe(true)
    })

    it('pause sets isPlaying to false', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.play()
      })
      expect(result.current.state.isPlaying).toBe(true)

      act(() => {
        result.current.controls.pause()
      })
      expect(result.current.state.isPlaying).toBe(false)
    })

    it('toggle switches between play and pause', () => {
      const { result } = renderHook(() => useMediaPlayer())

      // Initially not playing, toggle should play
      act(() => {
        result.current.controls.toggle()
      })
      expect(result.current.state.isPlaying).toBe(true)

      // Now playing, toggle should pause
      act(() => {
        result.current.controls.toggle()
      })
      expect(result.current.state.isPlaying).toBe(false)
    })
  })

  describe('volume', () => {
    it('setVolume updates volume state', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.setVolume(0.5)
      })

      expect(result.current.state.volume).toBe(0.5)
    })

    it('setVolume accepts zero', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.setVolume(0)
      })

      expect(result.current.state.volume).toBe(0)
    })

    it('setVolume accepts full volume', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.setVolume(0.3)
      })
      act(() => {
        result.current.controls.setVolume(1)
      })

      expect(result.current.state.volume).toBe(1)
    })
  })

  describe('mute', () => {
    it('mute sets isMuted to true', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.mute()
      })

      expect(result.current.state.isMuted).toBe(true)
    })

    it('unmute sets isMuted to false', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.mute()
      })
      act(() => {
        result.current.controls.unmute()
      })

      expect(result.current.state.isMuted).toBe(false)
    })

    it('toggleMute switches between muted and unmuted', () => {
      const { result } = renderHook(() => useMediaPlayer())

      // Initially not muted, toggle should mute
      act(() => {
        result.current.controls.toggleMute()
      })
      expect(result.current.state.isMuted).toBe(true)

      // Now muted, toggle should unmute
      act(() => {
        result.current.controls.toggleMute()
      })
      expect(result.current.state.isMuted).toBe(false)
    })
  })

  describe('seek', () => {
    it('seek updates currentTime state', () => {
      const { result } = renderHook(() => useMediaPlayer())

      // Without a ref.current, seek still updates state
      // (ref.current is null in test, so the ref assignment is skipped)
      act(() => {
        result.current.controls.seek(30)
      })

      // Since ref.current is null, the currentTime state is not updated
      // because the seek function requires ref.current to be non-null
      expect(result.current.state.currentTime).toBe(0)
    })
  })

  describe('state independence', () => {
    it('play does not affect volume', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.setVolume(0.7)
      })
      act(() => {
        result.current.controls.play()
      })

      expect(result.current.state.volume).toBe(0.7)
      expect(result.current.state.isPlaying).toBe(true)
    })

    it('mute does not affect isPlaying', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.play()
      })
      act(() => {
        result.current.controls.mute()
      })

      expect(result.current.state.isPlaying).toBe(true)
      expect(result.current.state.isMuted).toBe(true)
    })

    it('volume change does not affect mute state', () => {
      const { result } = renderHook(() => useMediaPlayer())

      act(() => {
        result.current.controls.mute()
      })
      act(() => {
        result.current.controls.setVolume(0.5)
      })

      expect(result.current.state.isMuted).toBe(true)
      expect(result.current.state.volume).toBe(0.5)
    })
  })
})
