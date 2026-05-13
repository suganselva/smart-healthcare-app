from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


# Shared Properties
class RecordBase(BaseModel):
    symptoms: str
    # E.g. {"blood_pressure": "120/80", "heart_rate": 72}
    vitals: Optional[Dict[str, Any]] = None
    predicted_diagnosis: Optional[str] = None
    confidence_score: Optional[str] = None
    prescription: Optional[str] = None
    doctor_notes: Optional[str] = None


# Properties on creation
class RecordCreate(RecordBase):
    patient_id: int


# Properties on update
class RecordUpdate(RecordBase):
    pass


class RecordInDBBase(RecordBase):
    id: int
    patient_id: int
    record_date: datetime

    class Config:
        from_attributes = True


# Client Properties
class Record(RecordInDBBase):
    pass
