from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./devlog.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # needed for SQLite
    echo=False,
)


def init_db():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency: yields a DB session per request."""
    with Session(engine) as session:
        yield session
