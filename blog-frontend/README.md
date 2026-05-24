# BlogSpace — Next.js Frontend

A full-featured blog platform frontend built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI**.

## Pages

| Route | Description |
|-------|-------------|
| `/feed` | Browse all articles (GET /api/articles) |
| `/write` | Publish a new article (POST /api/articles) |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Make sure your FastAPI backend is running at `http://localhost:8000` before starting.

---

## Backend API Expected

The app proxies all `/api/*` requests to `http://localhost:8000` via `next.config.js`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Fetch all articles |
| POST | `/api/articles` | Create a new article |
| POST | `/api/interactions` | Log a view interaction |

### Expected article shape (JSON)

```json
{
  "id": "1",
  "title": "My First Article",
  "content": "Lorem ipsum...",
  "author": "Yashwanth",
  "tags": ["tech", "python"],
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI (manually bundled — no CLI needed)
- **Fonts:** Lora + DM Sans (Google Fonts)
- **Icons:** Lucide React

## CORS Fix

The proxy in `next.config.js` handles CORS automatically. If you still face issues, add this to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
