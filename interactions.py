from fastapi import APIRouter, Depends, status, HTTPException
from schemas import BookmarkCreate  # Using the clean schemas file
from typing import Optional

router = APIRouter(prefix="/api", tags=["Timeline Interaction & Curation"])

# Mock dependency for acquiring the logged-in user context
def get_current_user_id() -> Optional[int]:
    """
    Returns an integer user ID if authenticated.
    Returns None for anonymous readers (Public Access model).
    """
    return 42

def require_auth(user_id: Optional[int] = Depends(get_current_user_id)) -> int:
    """Enforces that certain actions require an account."""
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be logged in to interact with the feed."
        )
    return user_id


@router.post("/bookmarks", status_code=status.HTTP_201_CREATED)
async def bookmark_article(bookmark: BookmarkCreate, user_id: int = Depends(require_auth)):
    """
    **Feature 7: Bookmark an article**
    - **Database Action**: `INSERT INTO bookmarks (user_id, article_id, created_at)`
    - **Track A Context**: A completely explicit action allowing readers to save entries 
      for late-night reading, entirely isolated from any algorithmic recommendations.
    """
    # Inline comment: Registers a personal saved list node bound explicitly to this user
    return {"message": f"Article {bookmark.article_id} added to your personal reading list."}


@router.delete("/bookmarks/{article_id}")
async def remove_bookmark(article_id: int, user_id: int = Depends(require_auth)):
    """
    **Feature 7 (Cont.): Remove bookmark**
    - **Database Action**: `DELETE FROM bookmarks WHERE user_id = :user_id AND article_id = :article_id`
    """
    # Inline comment: Target and delete only entries belonging to the active user context
    return {"message": f"Article {article_id} removed from your personal reading list."}


@router.post("/articles/{article_id}/like", status_code=status.HTTP_200_OK)
async def like_article(article_id: int, user_id: int = Depends(require_auth)):
    """
    **Feature Enhancement: Transparent Feedback**
    - **Database Action**: `INSERT INTO article_likes (user_id, article_id)`
    - **Track A Context**: Likes under Track A act purely as a transparent community 
      appreciation counter shown on the article, never as a weight modifier for your feed.
    """
    # Inline comment: Records a static feedback transaction without registering implicit tracking telemetry
    return {"message": f"Article {article_id} successfully liked."}


@router.delete("/articles/{article_id}/like", status_code=status.HTTP_200_OK)
async def unlike_article(article_id: int, user_id: int = Depends(require_auth)):
    """
    **Feature Enhancement: Remove Feedback**
    - **Database Action**: `DELETE FROM article_likes WHERE user_id = :user_id AND article_id = :article_id`
    """
    return {"message": f"Like removed from article {article_id}."}
