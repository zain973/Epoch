from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, JSON, Column
import json


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    author: str
    tags: str = Field(default="[]")   # stored as JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def get_tags(self) -> List[str]:
        return json.loads(self.tags)


class Interaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(index=True)
    interaction_type: str = Field(default="view")   # view | like | share
    user_email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
