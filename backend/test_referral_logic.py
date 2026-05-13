from services.ml import ml_service
import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

def test_referral():
    print("Testing referral prediction...")
    try:
        result = ml_service.predict_referral(
            disease="Fever",
            confidence_score=0.9,
            location="Bangalore"
        )
        print(f"Result: {result}")
    except Exception as e:
        print(f"CRASH DETECTED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_referral()
