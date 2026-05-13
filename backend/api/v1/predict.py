from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import date

from api import deps
from schemas.record import RecordCreate, Record
from models.record import MedicalRecord
from models.patient import Patient
from models.user import User
from services.ml import ml_service

router = APIRouter()

@router.post("/", response_model=Record)
def predict_and_store_record(
    *, 
    db: Session = Depends(deps.get_db), 
    record_in: RecordCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Takes patient symptoms and vitals, runs ML prediction, and stores the medical record.
    """
    # Check if patient exists and belongs to user
    patient = db.query(Patient).filter(Patient.id == record_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if not current_user.is_superuser and patient.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to add record for this patient")

    # Run prediction
    vitals_data = record_in.vitals if record_in.vitals else {}
    prediction_result = ml_service.predict_disease(record_in.symptoms, vitals_data)
    
    # Run prescription prediction
    from datetime import date
    patient_age = date.today().year - patient.date_of_birth.year
    if (date.today().month, date.today().day) < (patient.date_of_birth.month, patient.date_of_birth.day):
        patient_age -= 1
        
    patient_data = {
        "age": patient_age,
        "gender": patient.gender
    }
    
    prescription = ml_service.predict_prescription(
        patient_data=patient_data, 
        vitals=vitals_data, 
        predicted_disease=prediction_result["predicted_diagnosis"]
    )
    
    # Create record in DB with the prediction appended
    record = MedicalRecord(
        patient_id=record_in.patient_id,
        doctor_id=current_user.id,
        symptoms=record_in.symptoms,
        vitals=record_in.vitals,
        predicted_diagnosis=prediction_result["predicted_diagnosis"],
        confidence_score=prediction_result["confidence_score"],
        prescription=prescription,
        doctor_notes=record_in.doctor_notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.post("/re-diagnose/{record_id}")
def re_diagnose_record(
    record_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Reruns the ML prediction for an existing medical record.
    Useful for fixing 'System Error' records created before models were loaded.
    """
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Run fresh prediction
    vitals_data = record.vitals if record.vitals else {}
    prediction_result = ml_service.predict_disease(record.symptoms, vitals_data)
    
    # Run fresh prescription prediction
    patient_age = date.today().year - patient.date_of_birth.year
    patient_data = {"age": patient_age, "gender": patient.gender}
    
    prescription = ml_service.predict_prescription(
        patient_data=patient_data, 
        vitals=vitals_data, 
        predicted_disease=prediction_result["predicted_diagnosis"]
    )
    
    # Update record
    record.predicted_diagnosis = prediction_result["predicted_diagnosis"]
    record.confidence_score = prediction_result["confidence_score"]
    record.prescription = prescription
    
    db.commit()
    db.refresh(record)
    
    return {
        "record": record,
        "alternatives": prediction_result["alternatives"]
    }

from pydantic import BaseModel
from typing import List

class PrescriptionPredictionRequest(BaseModel):
    symptoms: str
    disease: str
    patient_data: Dict[str, Any]

class ReferralPredictionRequest(BaseModel):
    disease: str
    confidence_score: float
    location: str

@router.post("/prescription")
def predict_structured_prescription(request: PrescriptionPredictionRequest, current_user: User = Depends(deps.get_current_active_user)):
    """
    Returns an ML-predicted structured array of prescription medications for a disease/symptom pair.
    """
    return ml_service.predict_structured_prescription(request.symptoms, request.disease, request.patient_data)

@router.post("/referral")
def predict_referral(request: ReferralPredictionRequest, current_user: User = Depends(deps.get_current_active_user)):
    """
    Returns an ML-predicted specialist referral matching.
    """
    return ml_service.predict_referral(request.disease, request.confidence_score, request.location)

