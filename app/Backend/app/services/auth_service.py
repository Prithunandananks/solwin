import logging
import uuid
from datetime import timedelta
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, verify_password
from app.core.config import get_settings
from app.models.user import User
from app.schemas.auth import CurrentUserResponse, TokenResponse

logger = logging.getLogger(__name__)
settings = get_settings()


class AuthService:
    """Service layer handling user authentication and token creation."""

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Look up user by normalized lowercase email address."""
        if not email:
            return None
        normalized_email = email.strip().lower()
        stmt = select(User).where(User.email == normalized_email)
        return db.scalar(stmt)

    @staticmethod
    def get_user_by_id(db: Session, user_id: uuid.UUID) -> Optional[User]:
        """Look up user by unique primary key ID."""
        stmt = select(User).where(User.id == user_id)
        return db.scalar(stmt)

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user credentials; returns user if valid, else None."""
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def login(db: Session, email: str, password: str) -> TokenResponse:
        """Authenticate user and return standard TokenResponse."""
        user = AuthService.authenticate_user(db, email, password)
        if not user:
            raise ValueError("Incorrect email or password.")
        if not user.is_active:
            raise PermissionError("User account is inactive.")

        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        claims = {
            "email": user.email,
            "role": user.role.value if hasattr(user.role, "value") else str(user.role),
        }
        token = create_access_token(
            subject=str(user.id),
            claims=claims,
            expires_delta=expires_delta,
        )

        expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=expires_in_seconds,
            user=CurrentUserResponse.model_validate(user),
        )
