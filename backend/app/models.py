"""SQLModel entities for the Task management API."""

from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


def utc_now() -> datetime:
    """Return current UTC time."""
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    """
    User entity stored in Neon PostgreSQL.

    Attributes:
        id: Unique user identifier (UUID string)
        email: User email (unique, stored lowercase)
        name: User display name
        password_hash: Bcrypt hashed password (NEVER store plaintext)
        created_at: Account creation timestamp
    """

    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    password_hash: str
    created_at: datetime = Field(default_factory=utc_now)


class Task(SQLModel, table=True):
    """
    Task entity stored in Neon PostgreSQL.

    Attributes:
        id: Unique task identifier (auto-increment)
        user_id: Owner identifier from JWT 'sub' claim
        title: Task title (1-200 characters, required)
        description: Task details (optional)
        is_completed: Completion status (default: false)
        created_at: Creation timestamp
        updated_at: Last modification timestamp
    """

    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
