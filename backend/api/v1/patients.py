from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from api import deps
from db.session import SessionLocal
from models.patient import Patient as PatientModel
from models.record import MedicalRecord
from models.user import User
from schemas.patient import Patient as PatientSchema, PatientCreate, PatientWithRecords

router = APIRouter()


@router.post("/", response_model=PatientSchema)
def create_patient(
    *, 
    db: Session = Depends(deps.get_db), 
    patient_in: PatientCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Create new patient.
    """
    patient = PatientModel(
        first_name=patient_in.first_name,
        last_name=patient_in.last_name,
        date_of_birth=patient_in.date_of_birth,
        gender=patient_in.gender,
        contact_number=patient_in.contact_number,
        address=patient_in.address,
        owner_id=current_user.id
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/", response_model=List[PatientSchema])
def read_patients(
    *, 
    db: Session = Depends(deps.get_db), 
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve patients.
    """
    if current_user.is_superuser:
        patients = db.query(PatientModel).offset(skip).limit(limit).all()
    else:
        patients = db.query(PatientModel).filter(PatientModel.owner_id == current_user.id).offset(skip).limit(limit).all()
    return patients


@router.get("/with-records", response_model=List[PatientWithRecords])
def read_patients_with_records(
    *, 
    db: Session = Depends(deps.get_db), 
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve patients with their latest medical records.
    """
    if current_user.is_superuser:
        patients = db.query(PatientModel).offset(skip).limit(limit).all()
    else:
        patients = db.query(PatientModel).filter(PatientModel.owner_id == current_user.id).offset(skip).limit(limit).all()
        
    results = []
    for p in patients:
        latest_record = db.query(MedicalRecord).filter(MedicalRecord.patient_id == p.id).order_by(MedicalRecord.record_date.desc()).first()
        record_data = None
        if latest_record:
            record_data = {
                "id": latest_record.id,
                "symptoms": latest_record.symptoms,
                "vitals": latest_record.vitals,
                "predicted_diagnosis": latest_record.predicted_diagnosis,
                "confidence_score": latest_record.confidence_score,
                "prescription": latest_record.prescription,
                "record_date": latest_record.record_date,
            }
        
        p_dict = {
            "id": p.id,
            "first_name": p.first_name,
            "last_name": p.last_name,
            "date_of_birth": p.date_of_birth,
            "gender": p.gender,
            "contact_number": p.contact_number,
            "address": p.address,
            "latest_record": record_data
        }
        results.append(p_dict)
        
    return results


@router.get("/{patient_id}", response_model=PatientSchema)
def read_patient(
    *, 
    db: Session = Depends(deps.get_db), 
    patient_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get patient by ID.
    """
    patient = (
        db.query(PatientModel)
        .filter(PatientModel.id == patient_id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if not current_user.is_superuser and patient.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return patient
