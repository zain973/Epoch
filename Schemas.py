from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime


# 1. IDENTITY & AUTHENTICATION SCHEMAS


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=20, description="Unique display name")
    email: EmailStr
    password: str = Field(..., min_length=8, description="Plaintext password to be hashed by backend")
    is_author: bool = Field(default=False, description="Flag determining timeline writing privileges")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UpdateBio(BaseModel):
    # Enforces layout compliance for Swiss Minimalism layout blocks
    bio: str = Field(..., max_length=160, description="Author short biography snippet")



# 2. CONTENT & TIMELINE SCHEMAS (Track A / Epoch Specific)


class ArticleCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=100, description="High-contrast bold headline")
    content: str = Field(..., min_length=20, description="Raw markdown content string")
    
    # Enforces Board rule: Every post must have between 1 and 5 descriptive category tags
    tags: List[str] = Field(
        ..., 
        min_items=1, 
        max_items=5, 
        description="List of text category taxonomies"
    )

    @field_validator("tags")
    @classmethod
    def clean_and_validate_tags(cls, tags_list: List[str]) -> List[str]:
        # Format tags consistently to avoid breaking global search sorting
        cleaned = [tag.strip().lower() for tag in tags_list if tag.strip()]
        if not cleaned:
            raise ValueError("An article must contain at least 1 valid category tag.")
        if len(cleaned) > 5:
            raise ValueError("Strict baseline limit exceeded: Maximum 5 tags allowed per post.")
        return cleaned

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    content: Optional[str] = Field(None, min_length=20)
    tags: Optional[List[str]] = Field(None, min_items=1, max_items=5)



# 3. RESPONSE & ARCHIVE DIRECTORY SCHEMAS


class ArticleResponse(BaseModel):
    """
    Unified contract returned to the Timeline Ribbon frontend stream.
    """
    id: int
    title: str
    content: str
    author: str
    tags: List[str]
    published_at: datetime = Field(..., description="The definitive timestamp driving the chronological descending logic")

    class Config:
        from_attributes = True


class ArchiveLookbackQuery(BaseModel):
    """
    Schema validating the 'This Time Yesterday' discovery tool lookup parameter.
    """
    before_timestamp: datetime
