require('dotenv').config();

const express = require('express');
const cors = require('cors');
const videosRouter = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));

app.use(express.json());

app.use('/videos', videosRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
