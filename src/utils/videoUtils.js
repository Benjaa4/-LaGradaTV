export function parseVideoUrl(url) {
  let videoId = '';
  let thumbnail = '';
  let embedUrl = '';
  let platform = 'unknown';

  try {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
      if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } else if (url.includes('twitch.tv')) {
      platform = 'twitch';
      const parts = url.split('twitch.tv/');
      if (parts.length > 1) {
        const path = parts[1].split('?')[0];
        if (path.includes('videos/')) {
          // VOD
          videoId = path.split('videos/')[1];
          embedUrl = `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=true`;
          thumbnail = 'https://vod-secure.twitch.tv/_404/404_processing_320x180.png'; // Placeholder for VOD
        } else {
          // Live stream (channel)
          videoId = path;
          embedUrl = `https://player.twitch.tv/?channel=${videoId}&parent=${window.location.hostname}&autoplay=true`;
          thumbnail = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${videoId.toLowerCase()}-440x248.jpg`;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing URL", e);
  }

  return { videoId, thumbnail, embedUrl, platform };
}
