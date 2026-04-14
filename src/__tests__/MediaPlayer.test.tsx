import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MediaPlayer } from '../MediaPlayer'
import type { MediaEntity } from '@vasic-digital/media-types'

function makeEntity(overrides: Partial<MediaEntity> = {}): MediaEntity {
  return {
    id: 1,
    title: 'Inception',
    status: 'active',
    first_detected: '2024-01-01T00:00:00Z',
    last_updated: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('MediaPlayer', () => {
  it('renders with entity title', () => {
    render(<MediaPlayer entity={makeEntity()} streamURL="/stream/1" />)
    expect(screen.getByTestId('media-title')).toHaveTextContent('Inception')
  })

  it('renders video element for movie entities', () => {
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    expect(screen.getByTestId('video-element')).toBeTruthy()
    expect(screen.queryByTestId('audio-element')).toBeNull()
  })

  it('renders audio element for song entities', () => {
    const entity = makeEntity({ media_type: { id: 7, name: 'song', description: 'Song' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    expect(screen.getByTestId('audio-element')).toBeTruthy()
    expect(screen.queryByTestId('video-element')).toBeNull()
  })

  it('renders player controls', () => {
    render(<MediaPlayer entity={makeEntity()} streamURL="/stream/1" />)
    expect(screen.getByTestId('player-controls')).toBeTruthy()
  })

  it('renders media player container', () => {
    render(<MediaPlayer entity={makeEntity()} streamURL="/stream/1" />)
    expect(screen.getByTestId('media-player')).toBeTruthy()
  })

  it('renders audio element for music_album entities', () => {
    const entity = makeEntity({ media_type: { id: 6, name: 'music_album', description: 'Album' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    expect(screen.getByTestId('audio-element')).toBeTruthy()
    expect(screen.queryByTestId('video-element')).toBeNull()
  })

  it('renders video element for tv_episode entities', () => {
    const entity = makeEntity({ media_type: { id: 4, name: 'tv_episode', description: 'Episode' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    expect(screen.getByTestId('video-element')).toBeTruthy()
    expect(screen.queryByTestId('audio-element')).toBeNull()
  })

  it('renders video element when entity has no media_type', () => {
    const entity = makeEntity()
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    expect(screen.getByTestId('video-element')).toBeTruthy()
    expect(screen.queryByTestId('audio-element')).toBeNull()
  })

  it('sets src attribute on video element', () => {
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/42" />)
    const video = screen.getByTestId('video-element') as HTMLVideoElement
    expect(video.src).toContain('/stream/42')
  })

  it('sets src attribute on audio element', () => {
    const entity = makeEntity({ media_type: { id: 7, name: 'song', description: 'Song' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/99" />)
    const audio = screen.getByTestId('audio-element') as HTMLAudioElement
    expect(audio.src).toContain('/stream/99')
  })

  it('passes autoPlay prop to video element', () => {
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" autoPlay={true} />)
    const video = screen.getByTestId('video-element') as HTMLVideoElement
    expect(video.autoplay).toBe(true)
  })

  it('does not autoplay by default', () => {
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" />)
    const video = screen.getByTestId('video-element') as HTMLVideoElement
    expect(video.autoplay).toBe(false)
  })

  it('calls onEnded when video playback ends', () => {
    const onEnded = vi.fn()
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" onEnded={onEnded} />)
    fireEvent.ended(screen.getByTestId('video-element'))
    expect(onEnded).toHaveBeenCalledTimes(1)
  })

  it('calls onEnded when audio playback ends', () => {
    const onEnded = vi.fn()
    const entity = makeEntity({ media_type: { id: 7, name: 'song', description: 'Song' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" onEnded={onEnded} />)
    fireEvent.ended(screen.getByTestId('audio-element'))
    expect(onEnded).toHaveBeenCalledTimes(1)
  })

  it('calls onError when video playback errors', () => {
    const onError = vi.fn()
    const entity = makeEntity({ media_type: { id: 1, name: 'movie', description: 'Film' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" onError={onError} />)
    fireEvent.error(screen.getByTestId('video-element'))
    expect(onError).toHaveBeenCalledWith('Playback error')
  })

  it('calls onError when audio playback errors', () => {
    const onError = vi.fn()
    const entity = makeEntity({ media_type: { id: 7, name: 'song', description: 'Song' } })
    render(<MediaPlayer entity={entity} streamURL="/stream/1" onError={onError} />)
    fireEvent.error(screen.getByTestId('audio-element'))
    expect(onError).toHaveBeenCalledWith('Playback error')
  })

  it('displays different entity titles correctly', () => {
    render(<MediaPlayer entity={makeEntity({ title: 'The Matrix' })} streamURL="/stream/1" />)
    expect(screen.getByTestId('media-title')).toHaveTextContent('The Matrix')
  })
})
