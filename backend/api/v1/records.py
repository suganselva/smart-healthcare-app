from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from api import deps
from schemas.record import Record
from models.record import MedicalRecord
from models.patient import Patient
from models.user import User

router = APIRouter()

@router.get("/patient/{patient_id}", response_model=List[Record])
def get_patient_records(
    patient_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve all medical records for a specific patient.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if not current_user.is_superuser and patient.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to view this patient's records")

    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).order_by(MedicalRecord.record_date.desc()).all()
    return records

@router.get("/", response_model=List[Record])
def get_all_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve all medical records for dashboard aggregation.
    """
    if current_user.is_superuser:
        records = db.query(MedicalRecord).order_by(MedicalRecord.record_date.desc()).offset(skip).limit(limit).all()
    else:
        # Join with patient to check ownership, or just check doctor_id if that's what we set
        records = db.query(MedicalRecord).join(Patient).filter(Patient.owner_id == current_user.id).order_by(MedicalRecord.record_date.desc()).offset(skip).limit(limit).all()
        # Alternatively we could use doctor_id, assuming we set doctor_id on record creation.
    return records
