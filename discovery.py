from fastapi import APIRouter, status, HTTPException, Query
from datetime import datetime, timedelta
from typing import List, Optional
from schemas import ArticleResponse

router = APIRouter(prefix="/api/discovery", tags=["Timeline Discovery & Taxonomy"])

@router.get("/tags/{tag_name}/articles", response_model=List[ArticleResponse], status_code=status.HTTP_200_OK)
async def search_articles_by_tag(tag_name: str, limit: int = Query(default=20, le=50)):
    """
    **Feature 5: Filter Feed by Explicit Category Tag**
    
    - **Path Parameter**: `tag_name`
    - **Database Action**: 
      `SELECT * FROM articles `
      `JOIN article_tags ON articles.id = article_tags.article_id `
      `WHERE LOWER(article_tags.tag_name) = LOWER(:tag_name) `
      `ORDER BY articles.published_at DESC LIMIT :limit`
    
    - **Track A Context**: Enforces a non-algorithmic filtering mechanism. Even when 
      the stream is narrowed down to a single tag topic, the results are rigidly 
      presented in a strict descending chronological timeline ribbon.
    """
    # Inline comment: Normalize string casing to ensure global database search uniformity
    clean_tag = tag_name.strip().lower()
    
    # Mock return dataset built around Swiss Minimalism principles
    return [
        {
            "id": 201,
            "title": "Grid Systems in Graphic Design",
            "content": "The use of the grid system as an objective organizing tool is a fundamental tenet of Swiss design culture. It provides visual structure, balance, and intentional whitespace.",
            "author": "Josef Müller-Brockmann",
            "tags": [clean_tag, "design", "structure"],
            "published_at": datetime.utcnow()
        }
    ]

@router.get("/archive/yesterday", response_model=List[ArticleResponse], status_code=status.HTTP_200_OK)
async def view_past_timeline_epoch(limit: int = Query(default=15, le=30)):
    """
    **Discovery Feature: This Time Yesterday**
    
    - **Database Action**: 
      `SELECT * FROM articles `
      `WHERE published_at <= :twenty_four_hours_ago `
      `ORDER BY published_at DESC LIMIT :limit`
    
    - **Track A Context**: Fulfills the Board's mandate for alternative discovery 
      without behavioral tracking filters. It shifts the entire timeline ribbon view anchor 
      back exactly 24 hours, letting readers catch up on a completely shared community experience.
    """
    # Inline comment: Establish a concrete historical anchor baseline offset exactly 24 hours from the current runtime
    twenty_four_hours_ago = datetime.utcnow() - timedelta(days=1)
    
    return [
        {
            "id": 195,
            "title": "Clear Communications: The Vignelli Canon",
            "content": "If you can design one thing, you can design everything. Discipline, architectural geometry, and a strict limit on typefaces make reading effortless.",
            "author": "Massimo Vignelli",
            "tags": ["minimalism", "canon", "geometry"],
            "published_at": twenty_four_hours_ago - timedelta(minutes=45)
        }
    ]


