import pandas as pd
import json
import os

def process_drugs():
    csv_path = "d:/Rakesh/A Smart Healthcare Application/smart/backend/data/Medicine_Details.csv"
    if not os.path.exists(csv_path):
        print("CSV not found at", csv_path)
        return

    df = pd.read_csv(csv_path)
    
    # Filter for different types
    tablets = df[df['Medicine Name'].str.contains('Tablet', case=False)].head(30)
    syrups = df[df['Medicine Name'].str.contains('Syrup', case=False)].head(20)
    capsules = df[df['Medicine Name'].str.contains('Capsule', case=False)].head(20)
    injections = df[df['Medicine Name'].str.contains('Injection', case=False)].head(10)
    
    combined = pd.concat([tablets, syrups, capsules, injections])
    
    meds_list = []
    for _, row in combined.iterrows():
        name = row['Medicine Name'].split(' ')[0] # Get base name
        full_name = row['Medicine Name']
        uses = row['Uses']
        side_effects = row['Side_effects']
        
        # Determine category
        category = "Other"
        if "Syrup" in full_name: category = "Syrup/Tonic"
        elif "Tablet" in full_name: category = "Tablet"
        elif "Capsule" in full_name: category = "Capsule"
        elif "Injection" in full_name: category = "Injection"
        
        # Create a mock-style entry for frontend
        meds_list.append({
            "name": full_name,
            "dosage": "As prescribed",
            "frequency": "Once daily",
            "duration": "5 days",
            "category": category,
            "stock": 100,
            "uses": uses,
            "side_effects": side_effects
        })

    # Save for frontend reference
    output_path = "d:/Rakesh/A Smart Healthcare Application/smart/backend/data/expanded_meds.json"
    with open(output_path, "w") as f:
        json.dump(meds_list, f, indent=2)
    
    print(f"Processed {len(meds_list)} medications to {output_path}")

if __name__ == "__main__":
    process_drugs()
