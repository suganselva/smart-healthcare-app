from sqlalchemy import Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional, Any

from db.base import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    record_date: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # ML Prediction inputs and outputs
    symptoms: Mapped[str] = mapped_column(Text)
    vitals: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True) # E.g. {"blood_pressure": "120/80", "heart_rate": 72}
    predicted_diagnosis: Mapped[Optional[str]] = mapped_column(nullable=True)
    confidence_score: Mapped[Optional[str]] = mapped_column(nullable=True)
    prescription: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    doctor_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    patient: Mapped["Patient"] = relationship("Patient", back_populates="records")  # type: ignore
    doctor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id"), nullable=True)
    doctor: Mapped["User"] = relationship("User", back_populates="records") # type: ignore
