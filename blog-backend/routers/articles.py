from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import json

from database import get_session
from models import Article
from schemas import ArticleCreate, ArticleResponse

router = APIRouter()


def article_to_response(article: Article) -> ArticleResponse:
    return ArticleResponse(
        id=article.id,
        title=article.title,
        content=article.content,
        author=article.author,
        tags=article.get_tags(),
        created_at=article.created_at,
    )


# ── GET /api/articles ─────────────────────────────────────────────────────────
@router.get("/", response_model=List[ArticleResponse])
def get_articles(session: Session = Depends(get_session)):
    articles = session.exec(select(Article).order_by(Article.created_at.desc())).all()
    return [article_to_response(a) for a in articles]


# ── POST /api/articles ────────────────────────────────────────────────────────
@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(payload: ArticleCreate, session: Session = Depends(get_session)):
    if not payload.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")

    article = Article(
        title=payload.title.strip(),
        content=payload.content.strip(),
        author=payload.author.strip() or "Anonymous",
        tags=json.dumps(payload.tags),
    )
    session.add(article)
    session.commit()
    session.refresh(article)

    return article_to_response(article)


# ── GET /api/articles/{id} ────────────────────────────────────────────────────
@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, session: Session = Depends(get_session)):
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article_to_response(article)


# ── DELETE /api/articles/{id} ─────────────────────────────────────────────────
@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(article_id: int, session: Session = Depends(get_session)):
    article = session.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    session.delete(article)
    session.commit()
