from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    message: str
    name: str
    email: str


# ── Articles ──────────────────────────────────────────────────────────────────

class ArticleCreate(BaseModel):
    title: str
    content: str
    author: str = "Anonymous"
    tags: List[str] = []


class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    author: str
    tags: List[str]
    created_at: datetime


# ── Interactions ──────────────────────────────────────────────────────────────

class InteractionCreate(BaseModel):
    article_id: int
    interaction_type: str = "view"
    user_email: Optional[str] = None


class InteractionResponse(BaseModel):
    message: str
    article_id: int
    interaction_type: str
