import React, { useRef } from 'react'
import type { MediaEntity } from '@vasic-digital/media-types'
import { PlayerControls } from './PlayerControls'
import { useMediaPlayer } from './useMediaPlayer'

export interface MediaPlayerProps {
  entity: MediaEntity
  streamURL: string
  autoPlay?: boolean
  onEnded?: () => void
  onError?: (error: string) => void
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  entity,
  streamURL,
  autoPlay = false,
  onEnded,
  onError,
}) => {
  const { state, controls, ref } = useMediaPlayer()
  const mediaType = entity.media_type?.name ?? ''
  const isAudio = mediaType === 'song' || mediaType === 'music_album'

  return (
    <div data-testid="media-player" style={{ background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      <div data-testid="media-title" style={{ padding: '8px 12px', color: '#fff', fontSize: '0.9em' }}>
        {entity.title}
      </div>

      {isAudio ? (
        <audio
          ref={ref as React.RefObject<HTMLAudioElement>}
          src={streamURL}
          autoPlay={autoPlay}
          onEnded={onEnded}
          onError={() => onError?.('Playback error')}
          data-testid="audio-element"
          style={{ width: '100%' }}
        />
      ) : (
        <video
          ref={ref}
          src={streamURL}
          autoPlay={autoPlay}
          onEnded={onEnded}
          onError={() => onError?.('Playback error')}
          data-testid="video-element"
          style={{ width: '100%', maxHeight: '480px' }}
        />
      )}

      <PlayerControls state={state} controls={controls} />
    </div>
  )
}
