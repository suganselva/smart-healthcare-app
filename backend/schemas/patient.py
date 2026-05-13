from pydantic import BaseModel
from typing import Optional, Any
from datetime import date


# Base Patient Schema
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    contact_number: Optional[str] = None
    address: Optional[str] = None


# Properties to receive on creation
class PatientCreate(PatientBase):
    pass


# Properties to receive on update
class PatientUpdate(PatientBase):
    pass


# Properties shared by models stored in DB
class PatientInDBBase(PatientBase):
    id: int

    class Config:
        from_attributes = True


# Properties to return to client
class Patient(PatientInDBBase):
    pass


class PatientWithRecords(Patient):
    latest_record: Optional[Any] = None # Will be dict representing the Record

    class Config:
        from_attributes = True
