const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.webm'];
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Multer storage configuration.
 * Files are saved to uploads/ with a timestamp prefix to avoid name collisions.
 * Storage is abstracted here so it can later be swapped for Cloudinary or S3.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error('Only mp4, mov, and webm video files are allowed.'));
    return;
  }

  // Extension is the primary guard; some clients (e.g. curl) send application/octet-stream
  const mimeOk =
    ALLOWED_MIME_TYPES.includes(file.mimetype) ||
    file.mimetype === 'application/octet-stream';

  if (mimeOk) {
    cb(null, true);
    return;
  }

  cb(new Error('Only mp4, mov, and webm video files are allowed.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
});

/**
 * Returns all video filenames from the uploads folder.
 */
function getVideoFiles() {
  const files = fs.readdirSync(UPLOADS_DIR);
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  });
}

/**
 * GET /api/random-video
 * Randomly selects one video from uploads/ and returns its URL.
 */
router.get('/random-video', (_req, res) => {
  try {
    const videos = getVideoFiles();

    if (videos.length === 0) {
      return res.status(404).json({ error: 'No videos available.' });
    }

    const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[randomIndex];

    res.json({ url: `/uploads/${selectedVideo}` });
  } catch (error) {
    console.error('Error fetching random video:', error);
    res.status(500).json({ error: 'Failed to fetch a random video.' });
  }
});

/**
 * POST /api/upload
 * Accepts a single video file and saves it to uploads/.
 */
router.post('/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided.' });
    }

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully.',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video.' });
  }
});

// Multer error handler for invalid file types
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 500 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
});

module.exports = router;
