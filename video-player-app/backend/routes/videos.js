const express = require('express');
const videos = require('../data/videos.json');

const router = express.Router();

/**
 * GET /videos
 * Returns the video catalog. Edit backend/data/videos.json to add or remove videos.
 * Videos must be hosted externally (Cloudinary, YouTube, direct .mp4 URLs, etc.).
 */
router.get('/', (_req, res) => {
  res.json(videos);
});

module.exports = router;
