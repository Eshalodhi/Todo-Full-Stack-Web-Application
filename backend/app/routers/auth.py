"""Authentication API endpoints - register and login."""

import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.config import BETTER_AUTH_SECRET
from app.database import get_session
from app.models import User
from app.schemas import RegisterDTO, LoginDTO, AuthResponseDTO, UserDTO


router = APIRouter(prefix="/auth", tags=["Authentication"])

# JWT settings
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token with user_id in 'sub' claim."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + timedelta(days=JWT_EXPIRATION_DAYS),
    }
    return jwt.encode(payload, BETTER_AUTH_SECRET, algorithm=JWT_ALGORITHM)


# =============================================================================
# POST /auth/register - Create new user account
# =============================================================================

@router.post("/register", response_model=AuthResponseDTO, status_code=201)
async def register(
    data: RegisterDTO,
    session: Session = Depends(get_session),
) -> AuthResponseDTO:
    """
    Register a new user account.

    - Validates email is unique
    - Hashes password with bcrypt
    - Creates user in database
    - Returns JWT token for immediate login
    """
    # Normalize email to lowercase for case-insensitive comparison
    email_lower = data.email.lower().strip()

    # Check if user already exists
    existing = session.exec(
        select(User).where(User.email == email_lower)
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A user with this email already exists"
        )

    # Create new user with hashed password
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=email_lower,
        name=data.name.strip(),
        password_hash=hash_password(data.password),
        created_at=datetime.now(timezone.utc),
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate JWT token
    token = create_access_token(user.id, user.email)

    return AuthResponseDTO(
        user=UserDTO(id=user.id, email=user.email, name=user.name),
        token=token,
    )


# =============================================================================
# POST /auth/login - Authenticate existing user
# =============================================================================

@router.post("/login", response_model=AuthResponseDTO)
async def login(
    data: LoginDTO,
    session: Session = Depends(get_session),
) -> AuthResponseDTO:
    """
    Authenticate user and return JWT token.

    - Finds user by email (case-insensitive)
    - Verifies password with bcrypt
    - Returns generic error to prevent email enumeration
    """
    # Normalize email
    email_lower = data.email.lower().strip()

    # Find user by email
    user = session.exec(
        select(User).where(User.email == email_lower)
    ).first()

    # Generic error message - don't reveal if email exists
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token(user.id, user.email)

    return AuthResponseDTO(
        user=UserDTO(id=user.id, email=user.email, name=user.name),
        token=token,
    )
