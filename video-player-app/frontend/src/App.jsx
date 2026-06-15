import { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import VideoGallery from './components/VideoGallery';
import { fetchVideos } from './api/videoApi';
import { selectRandomVideo } from './utils/selectRandomVideo';
import styles from './App.module.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [mode, setMode] = useState('gallery');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [repeatCount, setRepeatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  const startRandomMode = useCallback(() => {
    const random = selectRandomVideo(videos);
    if (!random) return;
    setCurrentVideo(random);
    setRepeatCount(0);
    setMode('player');
  }, [videos]);

  const nextRandomVideo = useCallback(() => {
    const random = selectRandomVideo(videos, currentVideo);
    if (!random) return;
    setCurrentVideo(random);
    setRepeatCount(0);
  }, [videos, currentVideo]);

  const backToGallery = useCallback(() => {
    setMode('gallery');
    setCurrentVideo(null);
    setRepeatCount(0);
  }, []);

  /**
   * Random mode: replay same video up to 3 times, then switch to a new random video.
   * repeatCount tracks completed plays beyond the first (0 → 1st play, 1 → 2nd, 2 → 3rd).
   */
  const handleVideoEnded = useCallback(() => {
    if (repeatCount < 2) {
      setRepeatCount((prev) => prev + 1);
    } else {
      setCurrentVideo(selectRandomVideo(videos, currentVideo));
      setRepeatCount(0);
    }
  }, [repeatCount, videos, currentVideo]);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Video Library</h1>
          <p className={styles.subtitle}>
            {mode === 'player'
              ? 'Random mode — each video plays 3 times, then switches'
              : 'Pick a video from the gallery or play random'}
          </p>
        </header>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner} aria-hidden="true" />
            Loading videos...
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        {!loading && !error && mode === 'player' && currentVideo && (
          <section className={styles.playerSection}>
            <VideoPlayer
              key={currentVideo.url}
              video={currentVideo}
              onEnded={handleVideoEnded}
              repeatCount={repeatCount}
              showRepeatProgress
            />
            <div className={styles.playerActions}>
              <button type="button" className={styles.primaryButton} onClick={nextRandomVideo}>
                Next Random Video
              </button>
              <button type="button" className={styles.secondaryButton} onClick={backToGallery}>
                Back to Gallery
              </button>
            </div>
          </section>
        )}

        {!loading && !error && mode === 'gallery' && (
          <>
            <button
              type="button"
              className={styles.randomButton}
              onClick={startRandomMode}
              disabled={videos.length === 0}
            >
              <span className={styles.playIcon} aria-hidden="true">▶</span>
              Play Random Video
            </button>

            {selectedVideo ? (
              <section className={styles.playerSection}>
                <VideoPlayer key={selectedVideo.url} video={selectedVideo} />
              </section>
            ) : (
              <div className={styles.placeholder}>
                <p>Select a video to start watching</p>
              </div>
            )}

            <section className={styles.gallerySection}>
              <h2 className={styles.sectionTitle}>Browse</h2>
              <VideoGallery
                videos={videos}
                selectedVideo={selectedVideo}
                onSelect={setSelectedVideo}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
