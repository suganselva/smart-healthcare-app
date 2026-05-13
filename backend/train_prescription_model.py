import pandas as pd
import numpy as np
import random
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def generate_synthetic_data(num_samples=1500):
    """Generates synthetic patient data mapped to specific prescriptions."""
    np.random.seed(42)
    random.seed(42)
    
    # Define rules for specific diseases and their standard treatments
    disease_profiles = {
        "Diabetes": [
            ("Metformin 500mg Twice Daily", lambda age, bmi: True),
            ("Insulin Glargine 10 units Daily", lambda age, bmi: bmi > 30 and age > 50)
        ],
        "Hypertension": [
            ("Lisinopril 10mg Once Daily", lambda age, bp: bp < 160),
            ("Amlodipine 5mg + Lisinopril 10mg", lambda age, bp: bp >= 160)
        ],
        "Common Cold": [
            ("Rest and Hydration, Acetaminophen 500mg PRN", lambda age, _: True)
        ],
        "COVID-19": [
            ("Isolate, Rest, Hydration", lambda age, _: age < 60),
            ("Paxlovid 300mg/100mg Twice Daily", lambda age, _: age >= 60)
        ],
        "Heart Disease": [
            ("Aspirin 81mg + Atorvastatin 40mg", lambda age, _: True)
        ]
    }
    
    data = []
    
    diseases = list(disease_profiles.keys())
    
    for _ in range(num_samples):
        # Generate random base patient features
        age = np.random.randint(18, 90)
        gender = random.choice(["Male", "Female"])
        bmi = round(np.random.uniform(18.5, 40.0), 1)
        
        # Pick a disease
        disease = random.choice(diseases)
        
        # Correlate vitals with disease
        if disease == "Hypertension":
            systolic_bp = np.random.randint(130, 200)
            target_metric = systolic_bp
        elif disease == "Diabetes":
            systolic_bp = np.random.randint(110, 160)
            target_metric = bmi
        else:
            systolic_bp = np.random.randint(100, 140)
            target_metric = 0 # Not used for logic here
            
        diastolic_bp = int(systolic_bp * 0.6) + np.random.randint(-10, 10)
        heart_rate = np.random.randint(60, 110)
        
        # Apply logic to pick prescription
        possible_prescriptions = disease_profiles[disease]
        
        # Evaluate rules in reverse order (more specific overrides general if true)
        prescription = possible_prescriptions[0][0] # Default
        for pres, condition in reversed(possible_prescriptions):
            if condition(age, target_metric):
                prescription = pres
                break
                
        # Occasionally add some noise so model has to generalize
        if random.random() < 0.05:
            prescription = random.choice([p[0] for p in possible_prescriptions])
            
        data.append({
            "age": age,
            "gender": gender,
            "bmi": bmi,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "heart_rate": heart_rate,
            "predicted_disease": disease,
            "prescription": prescription
        })
        
    return pd.DataFrame(data)

def train_and_save_model():
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(2000)
    
    # Save the dataset just for reference
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    dataset_path = os.path.join(os.path.dirname(__file__), 'data', 'synthetic_prescriptions.csv')
    df.to_csv(dataset_path, index=False)
    print(f"Dataset saved to {dataset_path}")
    
    # Features and Target
    X = df.drop(columns=['prescription'])
    y = df['prescription']
    
    # Define preprocessing steps
    numeric_features = ['age', 'bmi', 'systolic_bp', 'diastolic_bp', 'heart_rate']
    categorical_features = ['gender', 'predicted_disease']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
        
    # Create the training pipeline
    rf_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    print("Training Random Forest model...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_pipeline.fit(X_train, y_train)
    
    # Evaluate
    accuracy = rf_pipeline.score(X_test, y_test)
    print(f"Model Accuracy on Test Set: {accuracy:.4f}")
    
    y_pred = rf_pipeline.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, 'prescription_model.joblib')
    
    joblib.dump(rf_pipeline, model_path)
    print(f"\nModel strictly saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
