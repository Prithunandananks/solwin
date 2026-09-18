import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import UserRole


class LoginRequest(BaseModel):
    """Credentials required for user authentication."""

    email: str = Field(..., max_length=255, description="User registered email address")
    password: str = Field(..., min_length=1, description="Account password")


class CurrentUserResponse(BaseModel):
    """User profile data returned for authenticated identity checks."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str = Field(..., max_length=255)
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    """Standard OAuth2/JWT token response."""

    access_token: str = Field(..., description="Signed JWT Bearer access token")
    token_type: str = Field("bearer", description="Token type (Bearer)")
    expires_in: int = Field(..., description="Token validity duration in seconds")
    user: CurrentUserResponse = Field(..., description="Authenticated user profile")
