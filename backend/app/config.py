"""Application configuration from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")
BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "")
CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

# Validation
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

if not BETTER_AUTH_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")
