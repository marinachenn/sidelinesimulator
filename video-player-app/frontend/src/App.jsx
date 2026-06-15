import { useState, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import { fetchRandomVideo, getVideoUrl } from './api/videoApi';
import styles from './App.module.css';

export default function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlayRandom = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentVideo(null);

    try {
      const data = await fetchRandomVideo();
      setCurrentVideo(getVideoUrl(data.url));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Random Video Player</h1>
          <p className={styles.subtitle}>
            Press play and watch a random video three times in a row
          </p>
        </header>

        <div className={styles.card}>
          <button
            className={styles.playButton}
            onClick={handlePlayRandom}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Loading...
              </>
            ) : (
              <>
                <span className={styles.playIcon} aria-hidden="true">▶</span>
                Play Random Video
              </>
            )}
          </button>

          {error && (
            <div className={styles.error} role="alert">
              {error === 'No videos available.' || error.includes('No videos')
                ? 'No videos have been uploaded.'
                : error}
            </div>
          )}

          {currentVideo && (
            <VideoPlayer
              key={currentVideo}
              videoUrl={currentVideo}
            />
          )}

          {!currentVideo && !loading && !error && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>🎬</div>
              <p>Click the button above to start watching</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
