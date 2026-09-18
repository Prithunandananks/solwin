import argparse
import os
import sys
import uuid
from datetime import datetime, timezone

# Add current dir to sys.path so app modules are resolvable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select

from app.core.auth import hash_password
from app.core.database import SessionLocal
from app.models.enums import UserRole
from app.models.user import User


def create_admin(email: str, full_name: str, password: str) -> None:
    """Bootstrap an initial administrator user in the database."""
    if not email or not password:
        print("Error: Email and password are required.", file=sys.stderr)
        sys.exit(1)

    normalized_email = email.strip().lower()
    db = SessionLocal()
    try:
        existing_user = db.scalar(select(User).where(User.email == normalized_email))
        if existing_user:
            print(
                f"User with email '{normalized_email}' already exists. "
                "Updating role to ADMIN and resetting password..."
            )
            existing_user.role = UserRole.ADMIN
            existing_user.hashed_password = hash_password(password)
            existing_user.full_name = full_name
            existing_user.is_active = True
            existing_user.updated_at = datetime.now(timezone.utc)
            db.commit()
            print(f"Admin user '{normalized_email}' updated successfully.")
            return

        admin_user = User(
            id=uuid.uuid4(),
            email=normalized_email,
            full_name=full_name,
            hashed_password=hash_password(password),
            role=UserRole.ADMIN,
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(admin_user)
        db.commit()
        print(
            f"Admin user '{normalized_email}' successfully created with ID: "
            f"{admin_user.id}"
        )
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(
        description="Create or bootstrap a Solwin admin user."
    )
    parser.add_argument(
        "--email",
        default=os.getenv("SOLWIN_ADMIN_EMAIL"),
        help="Admin email address (or set SOLWIN_ADMIN_EMAIL env var)",
    )
    parser.add_argument(
        "--name",
        default=os.getenv("SOLWIN_ADMIN_NAME", "Solwin Administrator"),
        help="Admin full name (or set SOLWIN_ADMIN_NAME env var)",
    )
    parser.add_argument(
        "--password",
        default=os.getenv("SOLWIN_ADMIN_PASSWORD"),
        help="Admin password (or set SOLWIN_ADMIN_PASSWORD env var)",
    )

    args = parser.parse_args()

    email = args.email
    full_name = args.name
    password = args.password

    if not email:
        email = input("Enter admin email: ").strip()
    if not password:
        import getpass

        password = getpass.getpass("Enter admin password: ").strip()

    create_admin(email=email, full_name=full_name, password=password)


if __name__ == "__main__":
    main()
