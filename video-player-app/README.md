# Video Library

A minimal Netflix-style video gallery. Videos are hosted externally; the backend serves only metadata. Built with React (Vite) and Node.js + Express.

## Architecture

- **Frontend (Vercel)** — fetches the catalog and renders a clickable gallery + player
- **Backend (Render)** — stateless Express API, no file storage
- **Videos** — hosted on Cloudinary, YouTube, or any direct `.mp4` URL
- **Catalog** — edit `backend/data/videos.json` and redeploy the backend to add videos

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

Runs at `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Adding Videos

Edit `backend/data/videos.json`:

```json
[
  {
    "title": "My Video",
    "description": "Optional description",
    "url": "https://res.cloudinary.com/your-account/video/upload/v123/myvideo.mp4"
  },
  {
    "title": "YouTube Clip",
    "description": "Unlisted YouTube link",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
]
```

Redeploy the backend on Render after changes.

## API

### `GET /videos`

Returns the full video catalog.

```json
[
  {
    "title": "Video 1",
    "description": "Optional",
    "url": "https://example.com/video1.mp4"
  }
]
```

### `GET /health`

Health check for Render.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001
```

In local dev, Vite proxies `/videos` to the backend — `.env` is optional.

## Deployment

| Service  | Platform | Notes |
|----------|----------|-------|
| Frontend | Vercel   | Set `VITE_API_URL` to your Render URL |
| Backend  | Render   | Set `FRONTEND_URL` to your Vercel URL. No disk/volume needed. |

## Scripts

| Location    | Command         | Description           |
|-------------|-----------------|-----------------------|
| `backend/`  | `npm start`     | Start API server      |
| `backend/`  | `npm run dev`   | Start with file watch |
| `frontend/` | `npm run dev`   | Start Vite dev server |
| `frontend/` | `npm run build` | Production build      |

## License

ISC
