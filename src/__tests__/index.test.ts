import { describe, it, expect } from 'vitest'
import {
  MediaPlayer,
  PlayerControls,
  useMediaPlayer,
} from '../index'

describe('index exports', () => {
  it('exports MediaPlayer component', () => {
    expect(MediaPlayer).toBeDefined()
    expect(typeof MediaPlayer).toBe('function')
  })

  it('exports PlayerControls component', () => {
    expect(PlayerControls).toBeDefined()
    expect(typeof PlayerControls).toBe('function')
  })

  it('exports useMediaPlayer hook', () => {
    expect(useMediaPlayer).toBeDefined()
    expect(typeof useMediaPlayer).toBe('function')
  })
})
