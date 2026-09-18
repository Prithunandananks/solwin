from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    intent = Column(String(100), nullable=True, index=True)
    issue = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attachments = relationship(
        "Attachment",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    ticket = relationship("Ticket", back_populates="attachments")
