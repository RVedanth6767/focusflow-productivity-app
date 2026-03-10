"""Database configuration for FocusFlow.

This module creates the SQLAlchemy engine/session used across the app.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./focusflow.db"

# check_same_thread=False is required by SQLite when used with FastAPI.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yield a database session to API handlers and close it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
