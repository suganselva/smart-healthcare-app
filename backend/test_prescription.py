import sys
import os

from services.ml import ml_service

def test_ml_system():
    print("--- Testing Smart Healthcare ML Pipeline ---")
    
    # Simulate data
    symptoms = "headache, severe chest pain, shortness of breath"
    vitals = {
        "temperature": 37.5, 
        "blood_pressure": "165/95", 
        "heart_rate": 105, 
        "bmi": 31.0
    }
    patient_data = {
        "age": 62, 
        "gender": "Male"
    }
    
    print(f"\nPatient Data: Age {patient_data['age']}, {patient_data['gender']}")
    print(f"Symptoms: {symptoms}")
    print(f"Vitals: BP {vitals['blood_pressure']}, BMI {vitals['bmi']}, HR {vitals['heart_rate']}")
    
    # 1. Disease Prediction
    print("\n1. Running Disease Prediction...")
    disease_result = ml_service.predict_disease(symptoms, vitals)
    
    predicted_disease = disease_result.get("predicted_diagnosis")
    confidence = disease_result.get("confidence_score")
    print(f"-> Predicted Diagnosis: {predicted_disease} (Confidence: {confidence})")
    
    # 2. Prescription Prediction
    print("\n2. Running Prescription Prediction...")
    prescription = ml_service.predict_prescription(patient_data, vitals, predicted_disease)
    
    print(f"-> Recommended Prescription: {prescription}")
    print("\n--- ML Pipeline Test Complete ---")

if __name__ == "__main__":
    test_ml_system()
