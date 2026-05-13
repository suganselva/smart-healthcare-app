import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
import os
import json
from models.prescription_model import PrescriptionPredictor
from models.referral_model import ReferralPredictor

class MLService:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        
        # Load Symptom Model
        try:
            self.symptom_model = joblib.load(os.path.join(self.models_dir, "symptom_model.joblib"))
            self.symptom_features = joblib.load(os.path.join(self.models_dir, "symptom_features.joblib"))
        except Exception as e:
            print(f"Warning: Could not load symptom model. {e}")
            self.symptom_model = None
            self.symptom_features = []

        # Load Prescription Model
        try:
            self.prescription_model = joblib.load(os.path.join(self.models_dir, "prescription_model.joblib"))
        except Exception as e:
            print(f"Warning: Could not load prescription model. {e}")
            self.prescription_model = None

        # Initialize the new structured ML Predictors
        self.structured_prescription_predictor = PrescriptionPredictor()
        self.structured_referral_predictor = ReferralPredictor()


    def predict_disease(self, symptoms: str, vitals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes symptoms to predict disease using trained RandomForest model.
        """
        if not self.symptom_model or not self.symptom_features:
            # Fallback if models are missing
            return {
                "predicted_diagnosis": "System Error: ML Models Not Loaded",
                "confidence_score": "0.0",
                "alternatives": []
            }
            
        # Parse symptoms (comma/space/underscore handling)
        symptoms_lower = symptoms.lower().replace(', ', ',').replace(' ', '_').split(',')
        
        # Initialize feature dictionary with 0s
        input_data = {feature: 0 for feature in self.symptom_features}
        
        # Map input symptoms to the dataset features
        for s in symptoms_lower:
            s_clean = s.strip()
            if not s_clean:
                continue

            for feature in self.symptom_features:
                if s_clean in feature.lower() or feature.lower() in s_clean:
                    input_data[feature] = 1
                    
        # Predict using a DataFrame
        df_input = pd.DataFrame([input_data])
        prediction = self.symptom_model.predict(df_input)[0]
        
        # Calculate confidence

        try:
            probs = self.symptom_model.predict_proba(df_input)[0]
            confidence = str(round(np.max(probs), 2))
            
            # Get top 3 alternatives
            top_indices = np.argsort(probs)[-3:][::-1]
            alternatives = [
                {
                    "disease": self.symptom_model.classes_[i],
                    "probability": round(float(probs[i]), 2)
                }
                for i in top_indices
            ]
        except:
            confidence = "0.85"
            alternatives = []
            
        return {
            "predicted_diagnosis": prediction,
            "confidence_score": confidence,
            "alternatives": alternatives
        }

    def predict_prescription(self, patient_data: Dict[str, Any], vitals: Dict[str, Any], predicted_disease: str) -> str:
        """
        Predicts the recommended prescription based on demographics, vitals, and predicted disease.
        This is used for legacy record storage.
        """
        # We reuse the structured predictor's logic for consistency
        results = self.structured_prescription_predictor.predict("", predicted_disease, patient_data)
        if results and results[0].get("medication"):
            main_med = results[0]["medication"]
            conf = results[0].get("confidence", 85.0)
            return json.dumps({"medication": str(main_med), "confidence": str(conf)})
        
        return json.dumps({
            "medication": "Standard clinical evaluation recommended.",
            "confidence": "0.0"
        })

    def predict_structured_prescription(self, symptoms: str, disease: str, patient_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """ Predicts structured prescriptions (medication, dosage, frequency, duration). """
        return self.structured_prescription_predictor.predict(symptoms, disease, patient_data)

    def predict_referral(self, disease: str, confidence_score: float, location: str) -> Dict[str, Any]:
        """ Predicts the best specialist for referral. """
        return self.structured_referral_predictor.predict(disease, confidence_score, location)


ml_service = MLService()
