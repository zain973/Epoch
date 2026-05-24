# DevLog Backend — FastAPI

A complete REST API backend for the DevLog tech blogging platform.

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite (via SQLModel)
- **Validation:** Pydantic v2

---

## Quick Start

### 1. Create a virtual environment

```bash
python -m venv venv

# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. (Optional) Seed the database with sample data

```bash
python seed.py
```

This creates a demo user and 6 sample articles.
- **Demo login:** `demo@devlog.com` / `password123`

### 4. Start the server

```bash
uvicorn main:app --reload --port 8000
```

The API is now live at **http://localhost:8000**

Interactive API docs: **http://localhost:8000/docs**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/articles/` | Get all articles (newest first) |
| POST | `/api/articles/` | Create a new article |
| GET | `/api/articles/{id}` | Get a single article |
| DELETE | `/api/articles/{id}` | Delete an article |
| POST | `/api/interactions/` | Log a view/like/share |
| GET | `/api/interactions/{article_id}` | Get interaction counts |

---

## Request Examples

### Sign Up
```json
POST /api/auth/signup
{
  "name": "Yashwanth",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

### Create Article
```json
POST /api/articles/
{
  "title": "My First Article",
  "content": "Hello world from DevLog!",
  "author": "Yashwanth",
  "tags": ["python", "fastapi"]
}
```

### Log Interaction
```json
POST /api/interactions/
{
  "article_id": 1,
  "interaction_type": "view"
}
```

---

## Folder Structure

```
blog-backend/
├── main.py           # App entry point, CORS, router wiring
├── database.py       # SQLite engine + session dependency
├── models.py         # SQLModel table definitions (User, Article, Interaction)
├── schemas.py        # Pydantic request/response schemas
├── seed.py           # Seed script for sample data
├── requirements.txt
└── routers/
    ├── auth.py         # /api/auth/signup, /api/auth/login
    ├── articles.py     # /api/articles CRUD
    └── interactions.py # /api/interactions logging
```
