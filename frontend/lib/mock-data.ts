export type Patient = {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  location: string
  phone: string
  medicalHistory: string[]
  allergies: string[]
  bloodType: string
  lastVisit: string
  status: "Active" | "Critical" | "Recovered" | "Follow-up"
  symptoms: Symptom[]
  vitals: Vitals
}

export type Symptom = {
  name: string
  severity: number
  duration: string
  onset: string
}

export type Vitals = {
  temperature: number
  systolicBP: number
  diastolicBP: number
  heartRate: number
  spO2: number
  respiratoryRate: number
}

export type Diagnosis = {
  id: string
  patientId: string
  disease: string
  confidence: number
  status: "confirmed" | "pending" | "referred"
  date: string
  alternativeDiagnoses: { disease: string; confidence: number }[]
  shapValues: { symptom: string; contribution: number }[]
  explanation: string
  recommendedTests: string[]
  treatment: string[]
}

export type Medication = {
  name: string
  dosage: string
  frequency: string
  duration: string
  category: string
  uses?: string
  sideEffects?: string
  contraindications: string[]
  interactions: string[]
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Amara Okafor",
    age: 34,
    gender: "Female",
    location: "Kigali Rural District",
    phone: "+250 788 123 456",
    medicalHistory: ["Mild anemia", "Previous malaria episode (2024)"],
    allergies: ["Penicillin"],
    bloodType: "A+",
    lastVisit: "2026-02-10",
    status: "Active",
    symptoms: [
      { name: "High Fever", severity: 8, duration: "3 days", onset: "2026-02-08" },
      { name: "Severe Headache", severity: 7, duration: "3 days", onset: "2026-02-08" },
      { name: "Body Chills", severity: 6, duration: "2 days", onset: "2026-02-09" },
      { name: "Joint Pain", severity: 5, duration: "2 days", onset: "2026-02-09" },
    ],
    vitals: { temperature: 39.2, systolicBP: 110, diastolicBP: 70, heartRate: 102, spO2: 96, respiratoryRate: 20 },
  },
  {
    id: "P002",
    name: "Kwame Mensah",
    age: 52,
    gender: "Male",
    location: "Accra Outskirts",
    phone: "+233 24 567 8901",
    medicalHistory: ["Type 2 Diabetes (2019)", "Hypertension (2020)"],
    allergies: [],
    bloodType: "O+",
    lastVisit: "2026-02-15",
    status: "Critical",
    symptoms: [
      { name: "Excessive Thirst", severity: 7, duration: "2 weeks", onset: "2026-02-01" },
      { name: "Frequent Urination", severity: 8, duration: "2 weeks", onset: "2026-02-01" },
      { name: "Blurred Vision", severity: 6, duration: "5 days", onset: "2026-02-10" },
      { name: "Fatigue", severity: 7, duration: "1 week", onset: "2026-02-08" },
      { name: "Numbness in Feet", severity: 5, duration: "3 days", onset: "2026-02-12" },
    ],
    vitals: { temperature: 37.1, systolicBP: 158, diastolicBP: 98, heartRate: 88, spO2: 97, respiratoryRate: 18 },
  },
  {
    id: "P003",
    name: "Fatima Diallo",
    age: 28,
    gender: "Female",
    location: "Dakar Suburb",
    phone: "+221 77 234 5678",
    medicalHistory: [],
    allergies: ["Sulfa drugs"],
    bloodType: "B+",
    lastVisit: "2026-02-18",
    status: "Active",
    symptoms: [
      { name: "Prolonged Fever", severity: 6, duration: "5 days", onset: "2026-02-13" },
      { name: "Abdominal Pain", severity: 7, duration: "4 days", onset: "2026-02-14" },
      { name: "Diarrhea", severity: 5, duration: "3 days", onset: "2026-02-15" },
      { name: "Loss of Appetite", severity: 4, duration: "5 days", onset: "2026-02-13" },
    ],
    vitals: { temperature: 38.5, systolicBP: 108, diastolicBP: 68, heartRate: 94, spO2: 98, respiratoryRate: 19 },
  },
  {
    id: "P004",
    name: "Ibrahim Hassan",
    age: 45,
    gender: "Male",
    location: "Nairobi Eastlands",
    phone: "+254 722 345 678",
    medicalHistory: ["Tuberculosis (treated 2022)", "Chronic cough"],
    allergies: [],
    bloodType: "AB+",
    lastVisit: "2026-02-20",
    status: "Follow-up",
    symptoms: [
      { name: "Persistent Cough", severity: 7, duration: "3 weeks", onset: "2026-01-30" },
      { name: "Night Sweats", severity: 6, duration: "2 weeks", onset: "2026-02-06" },
      { name: "Weight Loss", severity: 5, duration: "1 month", onset: "2026-01-20" },
      { name: "Chest Pain", severity: 4, duration: "1 week", onset: "2026-02-13" },
    ],
    vitals: { temperature: 37.8, systolicBP: 120, diastolicBP: 78, heartRate: 82, spO2: 94, respiratoryRate: 22 },
  },
  {
    id: "P005",
    name: "Grace Mwangi",
    age: 8,
    gender: "Female",
    location: "Kampala Rural",
    phone: "+256 772 456 789",
    medicalHistory: ["Sickle cell trait"],
    allergies: ["Aspirin"],
    bloodType: "O-",
    lastVisit: "2026-02-21",
    status: "Active",
    symptoms: [
      { name: "High Fever", severity: 9, duration: "2 days", onset: "2026-02-19" },
      { name: "Vomiting", severity: 7, duration: "1 day", onset: "2026-02-20" },
      { name: "Lethargy", severity: 8, duration: "2 days", onset: "2026-02-19" },
      { name: "Reduced Appetite", severity: 6, duration: "2 days", onset: "2026-02-19" },
    ],
    vitals: { temperature: 39.8, systolicBP: 90, diastolicBP: 60, heartRate: 120, spO2: 95, respiratoryRate: 28 },
  },
]

export const diagnoses: Diagnosis[] = [
  {
    id: "D001",
    patientId: "P001",
    disease: "Malaria (P. falciparum)",
    confidence: 91,
    status: "confirmed",
    date: "2026-02-10",
    alternativeDiagnoses: [
      { disease: "Dengue Fever", confidence: 45 },
      { disease: "Typhoid Fever", confidence: 32 },
      { disease: "Viral Infection", confidence: 18 },
    ],
    shapValues: [
      { symptom: "High Fever", contribution: 0.35 },
      { symptom: "Body Chills", contribution: 0.25 },
      { symptom: "Severe Headache", contribution: 0.18 },
      { symptom: "Joint Pain", contribution: 0.12 },
      { symptom: "Previous Malaria", contribution: 0.10 },
    ],
    explanation: "High confidence malaria diagnosis based on classic presentation: cyclic high fever (39.2C), chills, headache, and joint pain dog patient's previous malaria episode and endemic region residence significantly increase risk. SpO2 at 96% suggests no severe pulmonary involvement yet.",
    recommendedTests: ["Rapid Diagnostic Test (RDT)", "Blood Smear (Thick/Thin)", "Complete Blood Count"],
    treatment: ["Artemether-Lumefantrine (ACT)", "Paracetamol for fever", "Oral rehydration", "Bed rest"],
  },
  {
    id: "D002",
    patientId: "P002",
    disease: "Diabetic Complications (Uncontrolled T2DM)",
    confidence: 88,
    status: "confirmed",
    date: "2026-02-15",
    alternativeDiagnoses: [
      { disease: "Diabetic Neuropathy", confidence: 72 },
      { disease: "Hypertensive Crisis", confidence: 55 },
      { disease: "Diabetic Retinopathy", confidence: 48 },
    ],
    shapValues: [
      { symptom: "Excessive Thirst", contribution: 0.28 },
      { symptom: "Frequent Urination", contribution: 0.25 },
      { symptom: "Blurred Vision", contribution: 0.20 },
      { symptom: "Known Diabetes", contribution: 0.15 },
      { symptom: "Numbness in Feet", contribution: 0.12 },
    ],
    explanation: "Patient presents with classic signs of uncontrolled Type 2 Diabetes with emerging complications. Polydipsia and polyuria indicate poor glycemic control. Blurred vision suggests possible retinopathy. Peripheral numbness indicates early neuropathy. Elevated BP (158/98) requires concurrent management.",
    recommendedTests: ["HbA1c Level", "Fasting Blood Glucose", "Renal Function Panel", "Lipid Profile", "Eye Examination"],
    treatment: ["Metformin dose adjustment", "Consider insulin initiation", "Amlodipine for BP control", "Foot care education"],
  },
  {
    id: "D003",
    patientId: "P003",
    disease: "Typhoid Fever",
    confidence: 76,
    status: "pending",
    date: "2026-02-18",
    alternativeDiagnoses: [
      { disease: "Gastroenteritis", confidence: 52 },
      { disease: "Malaria", confidence: 38 },
      { disease: "Hepatitis A", confidence: 25 },
    ],
    shapValues: [
      { symptom: "Prolonged Fever", contribution: 0.30 },
      { symptom: "Abdominal Pain", contribution: 0.28 },
      { symptom: "Diarrhea", contribution: 0.22 },
      { symptom: "Loss of Appetite", contribution: 0.12 },
      { symptom: "Young Adult", contribution: 0.08 },
    ],
    explanation: "Moderate confidence typhoid diagnosis. The combination of step-ladder fever pattern over 5 days, abdominal tenderness, and GI symptoms is consistent. However, confirmation through blood culture is strongly recommended before definitive treatment to rule out alternative GI infections.",
    recommendedTests: ["Blood Culture (Widal Test)", "Stool Culture", "Complete Blood Count", "Liver Function Tests"],
    treatment: ["Azithromycin (pending culture)", "Oral rehydration therapy", "Bland diet", "Close monitoring"],
  },
  {
    id: "D004",
    patientId: "P004",
    disease: "Tuberculosis Reactivation",
    confidence: 68,
    status: "referred",
    date: "2026-02-20",
    alternativeDiagnoses: [
      { disease: "Chronic Bronchitis", confidence: 42 },
      { disease: "Lung Cancer", confidence: 28 },
      { disease: "Pneumonia", confidence: 35 },
    ],
    shapValues: [
      { symptom: "Persistent Cough", contribution: 0.32 },
      { symptom: "Night Sweats", contribution: 0.25 },
      { symptom: "Weight Loss", contribution: 0.20 },
      { symptom: "Previous TB History", contribution: 0.15 },
      { symptom: "Low SpO2", contribution: 0.08 },
    ],
    explanation: "Moderate confidence for TB reactivation given prior TB history (2022) and classic symptom triad: chronic productive cough (3 weeks), night sweats, and unintentional weight loss. SpO2 at 94% and elevated respiratory rate suggest pulmonary involvement. Specialist referral recommended for sputum testing and imaging.",
    recommendedTests: ["Sputum AFB Smear (x3)", "GeneXpert MTB/RIF", "Chest X-ray", "Tuberculin Skin Test"],
    treatment: ["Refer to TB specialist", "Respiratory isolation precautions", "Nutritional support", "Await sputum results"],
  },
  {
    id: "D005",
    patientId: "P005",
    disease: "Severe Malaria (Pediatric)",
    confidence: 93,
    status: "confirmed",
    date: "2026-02-21",
    alternativeDiagnoses: [
      { disease: "Meningitis", confidence: 35 },
      { disease: "Severe Viral Infection", confidence: 28 },
      { disease: "Pneumonia", confidence: 20 },
    ],
    shapValues: [
      { symptom: "Very High Fever", contribution: 0.30 },
      { symptom: "Lethargy", contribution: 0.25 },
      { symptom: "Vomiting", contribution: 0.20 },
      { symptom: "Tachycardia", contribution: 0.15 },
      { symptom: "Pediatric Age Group", contribution: 0.10 },
    ],
    explanation: "HIGH ALERT: Pediatric severe malaria presentation requiring urgent intervention. Temperature of 39.8C with marked lethargy and vomiting in an 8-year-old from an endemic area. Heart rate of 120 bpm and SpO2 of 95% indicate compensated shock. Sickle cell trait may complicate course. Immediate parenteral treatment required.",
    recommendedTests: ["Rapid Diagnostic Test (RDT)", "Blood Smear", "CBC with Differential", "Blood Glucose", "Renal Function"],
    treatment: ["IV Artesunate (emergency)", "IV Fluids", "Glucose monitoring", "Antipyretics", "Urgent pediatric referral"],
  },
]

export const medications: Medication[] = [
  {
    name: "Augmentin 625 Duo Tablet",
    dosage: "625mg",
    frequency: "Twice daily",
    duration: "5-7 days",
    category: "Tablet",
    uses: "Treatment of Bacterial infections",
    sideEffects: "Vomiting, Nausea, Diarrhea",
    contraindications: ["Penicillin allergy", "Severe hepatic impairment"],
    interactions: ["Warfarin", "Methotrexate"],
  },
  {
    name: "Azithral 500 Tablet",
    dosage: "500mg",
    frequency: "Once daily",
    duration: "3-5 days",
    category: "Tablet",
    uses: "Treatment of Bacterial infections",
    sideEffects: "Nausea, Abdominal pain, Diarrhea",
    contraindications: ["Macrolide hypersensitivity"],
    interactions: ["Antacids", "Digoxin"],
  },
  {
    name: "Ascoril LS Syrup",
    dosage: "10ml",
    frequency: "Three times daily",
    duration: "5 days",
    category: "Syrup/Tonic",
    uses: "Treatment of Cough with mucus",
    sideEffects: "Tremors, Palpitations, Nausea",
    contraindications: ["Severe hypertension", "Thyrotoxicosis"],
    interactions: ["Beta-blockers"],
  },
  {
    name: "Alex Syrup",
    dosage: "5-10ml",
    frequency: "Every 6-8 hours",
    duration: "3-5 days",
    category: "Syrup/Tonic",
    uses: "Treatment of Dry cough",
    sideEffects: "Sleepiness, Dizziness",
    contraindications: ["MAO inhibitors"],
    interactions: ["Alcohol", "Sedatives"],
  },
  {
    name: "Aciloc 150 Tablet",
    dosage: "150mg",
    frequency: "Twice daily",
    duration: "14 days",
    category: "Tablet",
    uses: "Acid reflux, Peptic ulcer",
    sideEffects: "Headache, Diarrhea",
    contraindications: ["Hypersensitivity"],
    interactions: ["Warfarin", "Theophylline"],
  },
  {
    name: "Allegra 120mg Tablet",
    dosage: "120mg",
    frequency: "Once daily",
    duration: "7 days",
    category: "Tablet",
    uses: "Allergic conditions",
    sideEffects: "Headache, Drowsiness",
    contraindications: ["Kidney disease"],
    interactions: ["Antacids", "Erythromycin"],
  },
  {
    name: "Almox 500 Capsule",
    dosage: "500mg",
    frequency: "Three times daily",
    duration: "7 days",
    category: "Capsule",
    uses: "Bacterial infections",
    sideEffects: "Nausea, Diarrhea, Rash",
    contraindications: ["Penicillin allergy"],
    interactions: ["Oral contraceptives", "Allopurinol"],
  },
  {
    name: "Antiflu 75mg Capsule",
    dosage: "75mg",
    frequency: "Twice daily",
    duration: "5 days",
    category: "Capsule",
    uses: "Influenza (Flu)",
    sideEffects: "Vomiting, Abdominal pain",
    contraindications: ["Hypersensitivity"],
    interactions: ["None significant"],
  },
  {
    name: "Atarax Syrup",
    dosage: "10ml",
    frequency: "At night",
    duration: "As needed",
    category: "Syrup/Tonic",
    uses: "Anxiety, Skin allergies",
    sideEffects: "Sedation, Dry mouth",
    contraindications: ["Long QT syndrome"],
    interactions: ["Alcohol", "CNS depressants"],
  },
  {
    name: "Arachitol 6L Injection",
    dosage: "1ml (600,000 IU)",
    frequency: "Once a month",
    duration: "3 months",
    category: "Injection",
    uses: "Vitamin D deficiency",
    sideEffects: "Injection site pain",
    contraindications: ["Hypercalcemia"],
    interactions: ["Thiazide diuretics"],
  },
  {
    name: "Metformin",
    dosage: "500-1000mg",
    frequency: "Twice daily with meals",
    duration: "Ongoing",
    category: "Tablet",
    contraindications: ["Renal impairment (eGFR <30)", "Metabolic acidosis"],
    interactions: ["Alcohol", "Iodinated contrast"],
  },
  {
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    duration: "Ongoing",
    category: "Tablet",
    contraindications: ["Severe aortic stenosis"],
    interactions: ["Simvastatin", "Cyclosporine"],
  },
  {
    name: "Paracetamol",
    dosage: "500-1000mg",
    frequency: "Every 4-6 hours",
    duration: "As needed",
    category: "Tablet",
    contraindications: ["Severe hepatic impairment"],
    interactions: ["Alcohol"],
  },
  {
    name: "Dextromethorphan",
    dosage: "15mg",
    frequency: "Every 6-8 hours",
    duration: "3-5 days",
    category: "Syrup/Tonic",
    contraindications: ["Asthma", "MAOI use"],
    interactions: ["Antidepressants"],
  },
  {
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "Every 8 hours",
    duration: "3 days",
    category: "Tablet",
    contraindications: ["Active peptic ulcer", "Third trimester pregnancy"],
    interactions: ["Aspirin", "Warfarin"],
  },
  {
    name: "Ciprofloxacin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "7 days",
    category: "Tablet",
    contraindications: ["Hypersensitivity to quinolones"],
    interactions: ["Dairy products", "Iron supplements"],
  },
  {
    name: "Artemether-Lumefantrine",
    dosage: "80/480mg",
    frequency: "Twice daily",
    duration: "3 days",
    category: "Tablet",
    contraindications: ["First trimester pregnancy"],
    interactions: ["Grapefruit juice"],
  },
]

export const labTests = [
  { name: "Complete Blood Count (CBC)", category: "Hematology", turnaround: "2-4 hours" },
  { name: "Blood Smear (Thick/Thin)", category: "Parasitology", turnaround: "1-2 hours" },
  { name: "Rapid Diagnostic Test (RDT)", category: "Immunology", turnaround: "15-30 minutes" },
  { name: "Blood Culture", category: "Microbiology", turnaround: "24-48 hours" },
  { name: "HbA1c Level", category: "Biochemistry", turnaround: "4-6 hours" },
  { name: "Fasting Blood Glucose", category: "Biochemistry", turnaround: "1-2 hours" },
  { name: "Liver Function Tests", category: "Biochemistry", turnaround: "4-6 hours" },
  { name: "Renal Function Panel", category: "Biochemistry", turnaround: "4-6 hours" },
  { name: "Lipid Profile", category: "Biochemistry", turnaround: "4-6 hours" },
  { name: "Chest X-ray", category: "Radiology", turnaround: "30-60 minutes" },
  { name: "Sputum AFB Smear", category: "Microbiology", turnaround: "24 hours" },
  { name: "GeneXpert MTB/RIF", category: "Molecular", turnaround: "2 hours" },
  { name: "Urinalysis", category: "Biochemistry", turnaround: "1-2 hours" },
  { name: "Widal Test", category: "Serology", turnaround: "2-4 hours" },
  { name: "Stool Culture", category: "Microbiology", turnaround: "24-72 hours" },
]

export const chatbotResponses: Record<string, string> = {
  greeting: "Hello! I'm MediAssist, your AI healthcare companion. I can help you with symptom interpretation, preventive health tips, medication reminders, and general wellness guidance. How can I assist you today?",
  symptoms: "Based on the symptoms you've described, I'd recommend monitoring your condition closely. Key warning signs to watch for include: sudden worsening of symptoms, difficulty breathing, persistent high fever above 39.5C, or confusion. If any of these occur, please seek immediate medical attention. Would you like me to help you prepare for a clinical assessment?",
  prevention: "Great question about prevention! Here are some key tips for staying healthy:\n\n1. Sleep 7-9 hours nightly for immune function\n2. Stay hydrated with at least 2L of clean water daily\n3. Use insecticide-treated bed nets in malaria-endemic areas\n4. Wash hands frequently with soap for at least 20 seconds\n5. Keep up with recommended vaccinations\n\nWould you like more specific advice based on your health profile?",
  medication: "I can help track your medications. Important reminders:\n\n- Always complete your full course of antibiotics\n- Take medications at consistent times each day\n- Never adjust doses without consulting your healthcare provider\n- Store medications as directed (some need refrigeration)\n- Report any unusual side effects immediately\n\nWould you like me to set up a medication schedule?",
  diet: "Nutrition plays a vital role in recovery and health maintenance. General recommendations:\n\n- Eat a balanced diet rich in fruits, vegetables, and lean proteins\n- Limit processed foods and added sugars\n- Include iron-rich foods if anemic (spinach, beans, fortified cereals)\n- Stay well-hydrated, especially during illness\n- For diabetic patients: monitor carbohydrate intake and choose low-glycemic foods\n\nShall I create a personalized meal plan suggestion?",
  fallback: "I understand your concern. While I can provide general health information and guidance, please remember that I'm an AI assistant and my advice should not replace professional medical consultation. For specific medical concerns, I recommend scheduling an appointment with your healthcare provider. Is there anything else I can help you with?",
}

export const dashboardStats = {
  totalPatients: 247,
  activeCases: 38,
  criticalAlerts: 5,
  diagnosesToday: 12,
  referralsPending: 8,
  avgConfidence: 83,
}

export const recentActivity = [
  { action: "New patient registered", patient: "Grace Mwangi", time: "15 min ago", type: "intake" as const },
  { action: "Diagnosis completed", patient: "Amara Okafor", time: "32 min ago", type: "diagnosis" as const },
  { action: "Specialist referral sent", patient: "Ibrahim Hassan", time: "1 hr ago", type: "referral" as const },
  { action: "Lab results received", patient: "Fatima Diallo", time: "2 hrs ago", type: "lab" as const },
  { action: "Prescription issued", patient: "Kwame Mensah", time: "3 hrs ago", type: "prescription" as const },
  { action: "Follow-up scheduled", patient: "Amara Okafor", time: "4 hrs ago", type: "followup" as const },
]

export const weeklyDiagnoses = [
  { day: "Mon", malaria: 4, typhoid: 2, diabetes: 1, hypertension: 3, other: 2 },
  { day: "Tue", malaria: 3, typhoid: 1, diabetes: 2, hypertension: 2, other: 3 },
  { day: "Wed", malaria: 5, typhoid: 3, diabetes: 1, hypertension: 4, other: 1 },
  { day: "Thu", malaria: 2, typhoid: 2, diabetes: 3, hypertension: 2, other: 4 },
  { day: "Fri", malaria: 6, typhoid: 1, diabetes: 2, hypertension: 3, other: 2 },
  { day: "Sat", malaria: 3, typhoid: 2, diabetes: 1, hypertension: 1, other: 1 },
  { day: "Sun", malaria: 1, typhoid: 1, diabetes: 0, hypertension: 1, other: 1 },
]

export const diseaseDistribution = [
  { name: "Malaria", value: 35, fill: "var(--color-chart-1)" },
  { name: "Typhoid", value: 18, fill: "var(--color-chart-2)" },
  { name: "Diabetes", value: 15, fill: "var(--color-chart-3)" },
  { name: "Hypertension", value: 20, fill: "var(--color-chart-4)" },
  { name: "Other", value: 12, fill: "var(--color-chart-5)" },
]
