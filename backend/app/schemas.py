"""Pydantic schemas (DTOs) for request/response validation."""

from typing import Optional
from sqlmodel import SQLModel, Field


# =============================================================================
# Auth DTOs
# =============================================================================

class RegisterDTO(SQLModel):
    """Request body for user registration."""

    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class LoginDTO(SQLModel):
    """Request body for user login."""

    email: str
    password: str


class AuthResponseDTO(SQLModel):
    """Response body for successful authentication."""

    user: "UserDTO"
    token: str


class UserDTO(SQLModel):
    """User data returned to client (no password)."""

    id: str
    email: str
    name: str


# =============================================================================
# Task DTOs
# =============================================================================

class CreateTaskDTO(SQLModel):
    """Request body for creating a new task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None


class UpdateTaskDTO(SQLModel):
    """Request body for updating an existing task (partial update)."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    is_completed: Optional[bool] = None
