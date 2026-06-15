import { useRef, useEffect, useCallback } from 'react';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../api/videoApi';
import styles from './VideoPlayer.module.css';

const MAX_REPEATS = 3;

/**
 * Plays a single video — HTML5 for direct URLs, iframe embed for YouTube.
 * When onEnded is provided, fires on each play-through (random mode).
 * repeatCount triggers a replay of the same video when incremented by the parent.
 */
export default function VideoPlayer({ video, onEnded, repeatCount = 0, showRepeatProgress = false }) {
  const videoRef = useRef(null);
  const prevRepeatCount = useRef(repeatCount);

  // Replay the same video when repeatCount increments (random mode)
  useEffect(() => {
    if (repeatCount > prevRepeatCount.current && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
    prevRepeatCount.current = repeatCount;
  }, [repeatCount]);

  const handleEnded = useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  if (!video) return null;

  const isYouTube = isYouTubeUrl(video.url);
  const currentPlay = Math.min(repeatCount + 1, MAX_REPEATS);

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.videoContainer}>
        {isYouTube ? (
          <iframe
            className={styles.iframe}
            src={getYouTubeEmbedUrl(video.url)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className={styles.video}
            src={video.url}
            controls
            playsInline
            autoPlay
            onEnded={onEnded ? handleEnded : undefined}
          />
        )}
      </div>

      {showRepeatProgress && !isYouTube && (
        <p className={styles.repeatLabel}>
          Repeat {currentPlay} of {MAX_REPEATS}
        </p>
      )}

      <div className={styles.meta}>
        <h2 className={styles.title}>{video.title}</h2>
        {video.description && (
          <p className={styles.description}>{video.description}</p>
        )}
      </div>
    </div>
  );
}
