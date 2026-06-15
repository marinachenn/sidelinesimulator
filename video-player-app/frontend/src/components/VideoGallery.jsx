import styles from './VideoGallery.module.css';

export default function VideoGallery({ videos, selectedVideo, onSelect }) {
  if (videos.length === 0) {
    return (
      <p className={styles.empty}>No videos in the library yet.</p>
    );
  }

  return (
    <div className={styles.grid}>
      {videos.map((video) => {
        const isSelected = selectedVideo?.url === video.url;

        return (
          <button
            key={video.url}
            type="button"
            className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
            onClick={() => onSelect(video)}
          >
            <div className={styles.thumbnail}>
              <span className={styles.playIcon} aria-hidden="true">▶</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{video.title}</h3>
              {video.description && (
                <p className={styles.cardDescription}>{video.description}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
