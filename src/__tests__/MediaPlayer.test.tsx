import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
