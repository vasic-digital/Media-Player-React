import React, { useRef } from 'react'
import type { MediaEntity } from '@vasic-digital/media-types'
import { PlayerControls } from './PlayerControls'
import { useMediaPlayer } from './useMediaPlayer'

/**
 * Props for the MediaPlayer component.
 */
export interface MediaPlayerProps {
  /** The media entity to play (used for title display and audio/video detection). */
  entity: MediaEntity
  /** URL of the media stream to load. */
  streamURL: string
  /** Whether to begin playback immediately on mount. */
  autoPlay?: boolean
  /** Called when playback reaches the end of the stream. */
  onEnded?: () => void
  /** Called when a playback error occurs. */
  onError?: (error: string) => void
}

/**
 * Entity-aware media player that renders an HTML5 audio or video element
 * based on the entity's media type. Includes a PlayerControls bar for
 * play/pause, seek, volume, and mute.
 *
 * @param props - MediaPlayerProps
 */
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
          ref={ref as React.RefObject<HTMLVideoElement>}
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
