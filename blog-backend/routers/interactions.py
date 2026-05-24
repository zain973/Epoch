from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List

from database import get_session
from models import Interaction, Article
from schemas import InteractionCreate, InteractionResponse

router = APIRouter()


# ── POST /api/interactions ────────────────────────────────────────────────────
@router.post("/", response_model=InteractionResponse, status_code=201)
def log_interaction(payload: InteractionCreate, session: Session = Depends(get_session)):
    # Validate article exists
    article = session.get(Article, payload.article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    interaction = Interaction(
        article_id=payload.article_id,
        interaction_type=payload.interaction_type,
        user_email=payload.user_email,
    )
    session.add(interaction)
    session.commit()

    return InteractionResponse(
        message="Interaction logged",
        article_id=payload.article_id,
        interaction_type=payload.interaction_type,
    )


# ── GET /api/interactions/{article_id} ───────────────────────────────────────
@router.get("/{article_id}")
def get_interactions(article_id: int, session: Session = Depends(get_session)):
    """Returns total interaction counts for a given article."""
    interactions = session.exec(
        select(Interaction).where(Interaction.article_id == article_id)
    ).all()

    counts: dict = {}
    for i in interactions:
        counts[i.interaction_type] = counts.get(i.interaction_type, 0) + 1

    return {
        "article_id": article_id,
        "total": len(interactions),
        "counts": counts,
    }
