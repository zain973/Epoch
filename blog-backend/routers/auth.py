from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import hashlib

from database import get_session
from models import User
from schemas import SignUpRequest, LoginRequest, AuthResponse

router = APIRouter()


def hash_password(password: str) -> str:
    """Simple SHA-256 hash. Use bcrypt in production."""
    return hashlib.sha256(password.encode()).hexdigest()


# ── POST /api/auth/signup ─────────────────────────────────────────────────────
@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, session: Session = Depends(get_session)):
    # Check if email already exists
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return AuthResponse(message="Account created successfully", name=user.name, email=user.email)


# ── POST /api/auth/login ──────────────────────────────────────────────────────
@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()

    if not user or user.hashed_password != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return AuthResponse(message="Login successful", name=user.name, email=user.email)
