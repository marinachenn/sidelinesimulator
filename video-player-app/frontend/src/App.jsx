import { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import VideoGallery from './components/VideoGallery';
import { fetchVideos } from './api/videoApi';
import styles from './App.module.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
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

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Video Library</h1>
          <p className={styles.subtitle}>
            Pick a video from the gallery below
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

        {!loading && !error && (
          <>
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
