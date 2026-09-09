export function parseVideoUrl(url) {
  let videoId = '';
  let thumbnail = '';
  let embedUrl = '';
  let platform = 'unknown';

  if (!url || typeof url !== 'string') {
    return { videoId, thumbnail, embedUrl, platform };
  }

  try {
    const trimmed = url.trim();

    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      platform = 'youtube';

      if (trimmed.includes('youtube.com/watch')) {
        videoId = new URL(trimmed).searchParams.get('v') || '';
      } else if (trimmed.includes('youtu.be/')) {
        videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0] || '';
      } else if (trimmed.includes('youtube.com/live/')) {
        videoId = trimmed.split('youtube.com/live/')[1]?.split('?')[0]?.split('/')[0] || '';
      } else if (trimmed.includes('youtube.com/shorts/')) {
        videoId = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
      } else if (trimmed.includes('youtube.com/embed/')) {
        videoId = trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('/')[0] || '';
      }

      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`;
      }
    } else if (trimmed.includes('twitch.tv')) {
      platform = 'twitch';
      const parts = trimmed.split('twitch.tv/');
      if (parts.length > 1) {
        const path = parts[1].split('?')[0];
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

        if (path.includes('videos/')) {
          // VOD
          videoId = path.split('videos/')[1];
          embedUrl = `https://player.twitch.tv/?video=${videoId}&parent=${hostname}&autoplay=true`;
          thumbnail = 'https://vod-secure.twitch.tv/_404/404_processing_320x180.png';
        } else {
          // Live stream (channel)
          videoId = path.replace('/', '');
          embedUrl = `https://player.twitch.tv/?channel=${videoId}&parent=${hostname}&autoplay=true`;
          thumbnail = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${videoId.toLowerCase()}-440x248.jpg`;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing video URL:", e);
  }

  return { videoId, thumbnail, embedUrl, platform };
}
