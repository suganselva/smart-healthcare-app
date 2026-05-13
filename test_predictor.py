import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from backend.models.prescription_model import PrescriptionPredictor

p = PrescriptionPredictor()
print("\n--- Testing Malaria Prediction ---")
res = p.predict("fever, chills, headache", "Malaria", {})
for m in res:
    print(m)

print("\n--- Testing Syrup Search ---")
res = p.predict("cough", "", {})
for m in res:
    print(m)
