# @vasic-digital/media-player

React media player for Catalogizer entity-aware playback. Provides HTML5 video/audio player with entity-aware type detection.

## Install

```bash
npm install @vasic-digital/media-player @vasic-digital/media-types
```

## Usage

```tsx
import { MediaPlayer } from '@vasic-digital/media-player'

function Player({ entity, client }) {
  const streamURL = client.entities.getStreamURL(entity.id, 'http://localhost:8080')
  return <MediaPlayer entity={entity} streamURL={streamURL} />
}
```

## License

MIT
