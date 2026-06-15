import { isYouTubeUrl, getYouTubeEmbedUrl } from '../api/videoApi';
import styles from './VideoPlayer.module.css';

/**
 * Plays a single video — HTML5 for direct URLs, iframe embed for YouTube.
 */
export default function VideoPlayer({ video }) {
  if (!video) return null;

  const isYouTube = isYouTubeUrl(video.url);

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
            className={styles.video}
            src={video.url}
            controls
            playsInline
            autoPlay
          />
        )}
      </div>
      <div className={styles.meta}>
        <h2 className={styles.title}>{video.title}</h2>
        {video.description && (
          <p className={styles.description}>{video.description}</p>
        )}
      </div>
    </div>
  );
}
