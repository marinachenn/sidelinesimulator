// Base API URL — uses env var in production, empty string in dev (Vite proxy handles it)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fetches a random video URL from the backend.
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function fetchRandomVideo() {
  const response = await fetch(`${API_BASE_URL}/api/random-video`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch random video.');
  }

  return data;
}

/**
 * Builds the full video URL from a relative path returned by the API.
 */
export function getVideoUrl(relativePath) {
  return `${API_BASE_URL}${relativePath}`;
}
