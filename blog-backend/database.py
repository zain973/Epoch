import os
from sqlmodel import SQLModel, create_engine, Session

# Dynamically fall back to local SQLite if no environment variable is provided
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./devlog.db")

# SQLAlchemy 1.4+ deprecated postgres:// protocol in favor of postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Only pass connect_args for SQLite to prevent connection pool issues on PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
    )


def init_db():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency: yields a DB session per request."""
    with Session(engine) as session:
        yield session
