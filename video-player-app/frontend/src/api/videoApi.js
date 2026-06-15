export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fetches the video catalog from the backend.
 * @returns {Promise<Array<{ title: string, description?: string, url: string }>>}
 */
export async function fetchVideos() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/videos`);

  if (!response.ok) {
    throw new Error('Failed to load videos.');
  }

  return response.json();
}

/**
 * Returns true if the URL points to a YouTube video.
 */
export function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

/**
 * Converts a YouTube watch/share URL into an embeddable iframe URL.
 */
export function getYouTubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}
