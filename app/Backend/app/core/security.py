import uuid
from datetime import datetime, timezone
from typing import Callable, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token
from app.core.database import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.services.auth_service import AuthService

# HTTP Bearer scheme with automatic OpenAPI/Swagger integration
http_bearer = HTTPBearer(
    auto_error=False,
    description="JWT Bearer token. Format: 'Bearer <access_token>'",
)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer JWT if provided, or return a default active admin user for public access."""
    now = datetime.now(timezone.utc)
    default_user = User(
        id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
        email="admin@solwin.ai",
        full_name="Solwin Administrator",
        hashed_password="",
        role=UserRole.ADMIN,
        is_active=True,
        created_at=now,
        updated_at=now,
    )

    if not credentials or not credentials.credentials:
        return default_user

    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if sub:
            user = AuthService.get_user_by_id(db, uuid.UUID(sub))
            if user:
                return user
    except Exception:
        pass

    return default_user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Verify that authenticated user is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


def require_role(*allowed_roles: UserRole) -> Callable[[User], User]:
    """Dependency factory enforcing role-based access control (RBAC)."""

    def role_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        user_role = current_user.role
        if user_role not in allowed_roles:
            role_name = (
                user_role.value if hasattr(user_role, "value") else str(user_role)
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Forbidden: user role '{role_name}' "
                    "does not have permission to access this resource."
                ),
            )
        return current_user

    return role_checker
