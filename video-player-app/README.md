# Random Video Player

A modern web app that plays a randomly selected video exactly **three times in a row**, then stops. Built with React (Vite) and Node.js + Express.

## Features

- **Play Random Video** — fetches and auto-plays a random video from the server
- **Triple replay** — each video plays exactly 3 consecutive times, then stops
- **Progress indicator** — shows "Repeat 1 of 3", "Repeat 2 of 3", etc.
- **Loading spinner** while fetching
- **Replay button** after completion
- **Upload API** — add videos via `POST /api/upload`
- **Deployment ready** — configured for Vercel (frontend) and Render (backend)

## Project Structure

```
video-player-app/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── api/       # API helpers
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Express API
│   ├── routes/
│   ├── uploads/       # Video storage (local; swappable for S3/Cloudinary)
│   └── server.js
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Backend

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:3001`.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Add Videos

Upload videos via the API (mp4, mov, or webm):

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "video=@/path/to/your/video.mp4"
```

Or place video files directly in `backend/uploads/`.

## API Endpoints

### `GET /api/random-video`

Returns a randomly selected video URL.

**Success (200):**
```json
{ "url": "/uploads/video2.mp4" }
```

**No videos (404):**
```json
{ "error": "No videos available." }
```

### `POST /api/upload`

Upload a single video file. Field name: `video`.

**Success (201):**
```json
{
  "success": true,
  "message": "Video uploaded successfully.",
  "url": "/uploads/1234567890-myvideo.mp4",
  "filename": "1234567890-myvideo.mp4"
}
```

### `GET /health`

Health check endpoint for deployment platforms.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

Copy from example:
```bash
cp .env.example .env
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001
```

For local development, the Vite dev server proxies `/api` and `/uploads` to the backend, so `.env` is optional in dev.

Copy from example:
```bash
cp .env.example .env
```

## Deployment

### Frontend — Vercel

1. Import the `frontend/` directory as a Vercel project.
2. Set environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://your-app.onrender.com`)
3. Deploy.

### Backend — Render

1. Create a new **Web Service** pointing to the `backend/` directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set environment variables:
   - `PORT` — Render sets this automatically
   - `FRONTEND_URL` — your Vercel frontend URL
5. **Note:** Render's ephemeral filesystem means uploaded videos won't persist across deploys. For production, replace the local `uploads/` storage with Cloudinary or AWS S3 (the route structure is designed for this swap).

## Storage Abstraction

Video storage is isolated in `backend/routes/video.js`:

- `multer.diskStorage` handles local file saves today
- `getVideoFiles()` reads from the uploads directory
- To migrate to cloud storage, replace the multer config and `getVideoFiles()` logic while keeping the same API response shape (`{ url: "..." }`)

## Scripts

| Location   | Command        | Description              |
|------------|----------------|--------------------------|
| `backend/` | `npm start`    | Start Express server     |
| `backend/` | `npm run dev`  | Start with file watch  |
| `frontend/`| `npm run dev`  | Start Vite dev server    |
| `frontend/`| `npm run build`| Production build         |
| `frontend/`| `npm run preview` | Preview production build |

## License

ISC
