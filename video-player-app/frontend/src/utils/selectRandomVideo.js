/**
 * Picks a random video from the list.
 * When excludeVideo is provided, avoids selecting it (falls back if only one video).
 */
export function selectRandomVideo(videos, excludeVideo = null) {
  if (videos.length === 0) return null;
  if (videos.length === 1) return videos[0];

  const pool = excludeVideo
    ? videos.filter((v) => v.url !== excludeVideo.url)
    : videos;

  const candidates = pool.length > 0 ? pool : videos;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
