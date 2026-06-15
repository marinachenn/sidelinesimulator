require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require('./routes/video');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow frontend origin in production via env var
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.json());

// Serve uploaded videos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', videoRoutes);

// Health check for deployment platforms
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
