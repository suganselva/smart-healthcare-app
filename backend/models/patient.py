from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, Text, ForeignKey
from typing import Optional, List
from datetime import date

from db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(index=True)
    last_name: Mapped[str] = mapped_column(index=True)
    date_of_birth: Mapped[date] = mapped_column(Date)
    gender: Mapped[str] = mapped_column()
    contact_number: Mapped[Optional[str]] = mapped_column(nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    owner_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id"), nullable=True)
    owner: Mapped["User"] = relationship("User", back_populates="patients") # type: ignore
    
    records: Mapped[List["MedicalRecord"]] = relationship(  # type: ignore
        "MedicalRecord", back_populates="patient", cascade="all, delete-orphan"
    )
