"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { diagnoses as mockDiagnoses } from "@/lib/mock-data"

import { Brain, Loader2 } from "lucide-react"
import { ConfidenceGauge } from "@/components/diagnosis/confidence-gauge"
import { ShapChart } from "@/components/diagnosis/shap-chart"
import { AlternativeDiagnoses } from "@/components/diagnosis/alternative-diagnoses"
import { DiagnosisExplanation } from "@/components/diagnosis/diagnosis-explanation"
import { ProcessingPipeline } from "@/components/diagnosis/processing-pipeline"

export default function DiagnosisPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [patientRecord, setPatientRecord] = useState<any>(null)
  const [realAlternatives, setRealAlternatives] = useState<any[]>([])
  const { token } = useAuth()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!token) return
    fetch(`${apiUrl}/api/v1/patients/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDbPatients(data))
      .catch(err => console.error("Failed to fetch patients", err))
  }, [token])

  useEffect(() => {
    if (!selectedPatientId || !token) {
      setPatientRecord(null)
      setRealAlternatives([])
      setShowResults(false)
      return
    }
    fetch(`${apiUrl}/api/v1/records/patient/${selectedPatientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPatientRecord(data[0])
        } else {
          setPatientRecord(null)
        }
      })
      .catch(err => console.error("Failed to fetch records", err))
  }, [selectedPatientId, token])

  const selectedDbPatient = dbPatients.find(p => p.id.toString() === selectedPatientId)

  const patient = selectedDbPatient && patientRecord ? {
    id: selectedDbPatient.id.toString(),
    name: `${selectedDbPatient.first_name}`,
    age: new Date().getFullYear() - new Date(selectedDbPatient.date_of_birth).getFullYear(),
    gender: selectedDbPatient.gender,
    location: selectedDbPatient.address || "Unknown",
    phone: selectedDbPatient.contact_number || "Unknown",
    medicalHistory: patientRecord.doctor_notes || "None",
    allergies: [],
    bloodType: "Unknown",
    lastVisit: patientRecord.record_date || new Date().toISOString(),
    status: "Active" as "Active" | "Critical" | "Recovered" | "Follow-up",
    symptoms: patientRecord.symptoms ? patientRecord.symptoms.split(",").map((s: string) => ({ name: s.trim().replace(/\(\d+\/10\)/, ''), severity: 5, duration: "2 days" })) : [],
    vitals: patientRecord.vitals || { temperature: 37, systolicBP: 120, diastolicBP: 80, heartRate: 72, spO2: 98, respiratoryRate: 16 }
  } : null;

  const diagnosis = patientRecord ? {
    id: `diag-${patientRecord.id}`,
    patientId: selectedPatientId,
    date: patientRecord.record_date || new Date().toISOString(),
    disease: patientRecord.predicted_diagnosis || "Evaluation Required",
    confidence: Math.round(parseFloat(patientRecord.confidence_score || "0.6") * 100),
    status: (parseFloat(patientRecord.confidence_score || "0.6") > 0.8) ? "confirmed" : "pending" as "confirmed" | "pending" | "referred",
    explanation: `Based on the reported symptoms and vital signs, the ML prediction indicates ${patientRecord.predicted_diagnosis}.`,
    recommendedActions: ["Monitor vitals", "Clinical assessment required", "Consider lab tests"],
    recommendedTests: ["Complete Blood Count", "Basic Metabolic Panel"],
    treatment: patientRecord.prescription ? [patientRecord.prescription] : ["Follow clinical guidelines based on final physician evaluation."],
    // Use real alternatives if available, otherwise fallback to mock for visuals
    shapValues: mockDiagnoses[0].shapValues,
    alternativeDiagnoses: realAlternatives.length > 0 
      ? realAlternatives.map(a => ({ disease: a.disease, confidence: Math.round(a.probability * 100) }))
      : mockDiagnoses[0].alternativeDiagnoses

  } : null;

  const runDiagnosis = async () => {
    if (!patientRecord || !token) return;
    
    setIsProcessing(true)
    setShowResults(false)
    
    try {
      const res = await fetch(`${apiUrl}/api/v1/predict/re-diagnose/${patientRecord.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPatientRecord(data.record);
        setRealAlternatives(data.alternatives);
      }
    } catch (err) {
      console.error("Diagnosis failed", err);
    } finally {
      setIsProcessing(false)
      setShowResults(true)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-primary" />
            <CardTitle>AI Diagnosis Engine</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              ML-Powered
            </Badge>
          </div>
          <CardDescription>
            Select a patient to run AI-assisted diagnosis with explainable results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="sm:w-[320px]">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {dbPatients.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.first_name} (ID: {p.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={runDiagnosis}
              disabled={!selectedPatientId || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 mr-1 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="size-4 mr-1" />
                  Run Diagnosis
                </>
              )}
            </Button>
          </div>

          {/* Patient Summary */}
          {patient && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold mb-2">Patient Summary</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Symptoms: </span>
                  <span className="font-medium">{patient.symptoms.length} reported</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Temp: </span>
                  <span className="font-mono font-medium">{patient.vitals.temperature}°C</span>
                </div>
                <div>
                  <span className="text-muted-foreground">BP: </span>
                  <span className="font-mono font-medium">
                    {patient.vitals.systolicBP}/{patient.vitals.diastolicBP} mmHg
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">SpO2: </span>
                  <span className="font-mono font-medium">{patient.vitals.spO2}%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {patient.symptoms.map((s: any) => (
                  <Badge key={s.name} variant="outline" className="text-xs">
                    {s.name} ({s.severity}/10)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Pipeline */}
      {isProcessing && <ProcessingPipeline />}

      {/* Results */}
      {showResults && diagnosis && (
        <div className="flex flex-col gap-6">
          {/* Safety Alert for High Risk */}
          {diagnosis.confidence >= 85 && diagnosis.disease.includes("Severe") && (
            <div className="flex items-center gap-3 rounded-lg border-2 border-destructive/50 bg-destructive/5 p-4">
              <div className="size-3 rounded-full bg-destructive animate-pulse" />
              <div>
                <p className="text-sm font-bold text-destructive">
                  HIGH PRIORITY ALERT
                </p>
                <p className="text-xs text-muted-foreground">
                  This patient requires immediate medical intervention. Please escalate to senior clinician.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Confidence Gauge */}
            <ConfidenceGauge
              disease={diagnosis.disease}
              confidence={diagnosis.confidence}
              status={diagnosis.status}
            />

            {/* SHAP Values */}
            <ShapChart shapValues={diagnosis.shapValues} />

            {/* Alternative Diagnoses */}
            <AlternativeDiagnoses
              alternatives={diagnosis.alternativeDiagnoses}
            />
          </div>

          {/* Explanation */}
          <DiagnosisExplanation
            diagnosis={diagnosis}
            patient={patient!}
          />
        </div>
      )}
    </div>
  )
}
