import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './VideoPlayer.module.css';

const MAX_PLAYS = 3;

/**
 * Reusable video player that plays a given video exactly three times,
 * then stops and shows a completion message.
 */
export default function VideoPlayer({ videoUrl, onReplay }) {
  const videoRef = useRef(null);
  const [playCount, setPlayCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset state when a new video is loaded
  useEffect(() => {
    setPlayCount(0);
    setFinished(false);
    setIsPlaying(false);
  }, [videoUrl]);

  const handleLoadedData = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.error('Autoplay failed:', err);
      });
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  /**
   * When the video ends: replay if under 3 plays, otherwise stop and show finished state.
   */
  const handleEnded = useCallback(() => {
    setPlayCount((prev) => {
      const nextCount = prev + 1;

      if (nextCount < MAX_PLAYS) {
        const video = videoRef.current;
        if (video) {
          video.currentTime = 0;
          video.play().catch((err) => {
            console.error('Replay failed:', err);
          });
        }
      } else {
        setFinished(true);
        setIsPlaying(false);
      }

      return nextCount;
    });
  }, []);

  const handleReplay = useCallback(() => {
    setPlayCount(0);
    setFinished(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.error('Replay failed:', err);
      });
    }
    onReplay?.();
  }, [onReplay]);

  const currentRepeat = finished
    ? MAX_PLAYS
    : isPlaying
      ? playCount + 1
      : Math.max(playCount, 1);

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.video}
          src={videoUrl}
          controls
          playsInline
          onLoadedData={handleLoadedData}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        />
      </div>

      {videoUrl && !finished && (
        <div className={styles.progress}>
          <span className={styles.progressLabel}>Playing</span>
          <div className={styles.progressDots}>
            {Array.from({ length: MAX_PLAYS }, (_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i < currentRepeat ? styles.dotActive : ''}`}
              />
            ))}
          </div>
          <span className={styles.progressText}>
            Repeat {currentRepeat} of {MAX_PLAYS}
          </span>
        </div>
      )}

      {finished && (
        <div className={styles.finished}>
          <p className={styles.finishedMessage}>
            Finished! Click Play Random Video to watch another.
          </p>
          <button className={styles.replayButton} onClick={handleReplay} type="button">
            Replay This Video
          </button>
        </div>
      )}
    </div>
  );
}
