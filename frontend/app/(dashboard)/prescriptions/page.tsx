"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { patients as mockPatients, medications, diagnoses as mockDiagnoses } from "@/lib/mock-data"
import {
  Pill,
  AlertTriangle,
  Search,
  Printer,
  Plus,
  X,
  Shield,
  Scale,
  Brain,
  BrainCircuit,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type PrescriptionItem = {
  medication: string
  dosage: string
  frequency: string
  duration: string
  confidence?: number // AI accuracy score
}

export default function PrescriptionsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [search, setSearch] = useState("")
  const [prescription, setPrescription] = useState<PrescriptionItem[]>([])
  const [isPredicting, setIsPredicting] = useState(false)
  const lastPredictedId = useRef<string | null>(null)
  const { token } = useAuth()
  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<Record<string, any>>({})
  const [dbDiagnoses, setDbDiagnoses] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!token) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/patients/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDbPatients(data)
        data.forEach((p: any) => {
          fetch(`${apiUrl}/api/v1/records/patient/${p.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(records => {
              if (records && records.length > 0) {
                const rec = records[0]
                setDbRecords(prev => ({ ...prev, [p.id]: rec }))
                setDbDiagnoses(prev => ({
                  ...prev,
                  [p.id]: {
                    disease: rec.predicted_diagnosis || "Evaluation Required",
                  }
                }))
              }
            })
        })
      })
      .catch(err => console.error(err))
  }, [token])

  const mappedPatients = dbPatients.map(p => {
    return {
      id: p.id.toString(),
      name: `${p.first_name}`,
      age: new Date().getFullYear() - new Date(p.date_of_birth).getFullYear(),
      gender: p.gender,
      allergies: [] as string[],
    }
  })

  const allPatients = mappedPatients.length > 0 ? mappedPatients : mockPatients;
  const patient = allPatients.find((p) => p.id === selectedPatientId)
  const diagnosis = dbDiagnoses[selectedPatientId]

  useEffect(() => {
    if (!selectedPatientId || !token || !patient || !diagnosis) return;
    if (lastPredictedId.current === selectedPatientId) return;

    const record = dbRecords[selectedPatientId];

    setIsPredicting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/predict/prescription`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        symptoms: record?.symptoms || "",
        disease: diagnosis.disease,
        patient_data: { age: patient.age, gender: patient.gender }
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Failed to predict prescription");
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPrescription(data)
          if (data.length > 0) {
            toast.success("AI generated prescription based on patient symptoms and disease.")
            lastPredictedId.current = selectedPatientId;
          }
        }
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to generate AI prescription")
      })
      .finally(() => {
        setIsPredicting(false)
      })
  }, [selectedPatientId, token, patient, diagnosis, dbRecords])

  const filteredMeds = medications.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase()) ||
    (m.uses && m.uses.toLowerCase().includes(search.toLowerCase()))
  )

  const addToPrescription = (med: typeof medications[number]) => {
    if (prescription.some((p) => p.medication === med.name)) return
    setPrescription((prev) => [
      ...prev,
      {
        medication: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      },
    ])
    toast.success(`${med.name} added to prescription`)
  }

  const removeFromPrescription = (name: string) => {
    setPrescription((prev) => prev.filter((p) => p.medication !== name))
  }

  const getInteractionWarnings = () => {
    const warnings: string[] = []
    const prescribedNames = prescription.map((p) => p.medication)
    for (const item of prescription) {
      const med = medications.find((m) => m.name === item.medication)
      if (med) {
        // Check if patient has allergies that match contraindications
        if (patient) {
          for (const allergy of patient.allergies) {
            for (const contra of med.contraindications) {
              if (contra.toLowerCase().includes(allergy.toLowerCase())) {
                warnings.push(
                  `${med.name}: Contraindicated due to ${allergy} allergy`
                )
              }
            }
          }
        }
        // Check for drug-drug interactions
        for (const interaction of med.interactions) {
          if (prescribedNames.some((n) => n !== med.name && interaction.includes(n))) {
            warnings.push(`${med.name}: Potential interaction with ${interaction}`)
          }
        }
      }
    }
    return warnings
  }

  const warnings = getInteractionWarnings()

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-6 text-primary" />
          <h1 className="text-xl font-semibold">AI Prescription Generator</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs ml-2">ML-Powered</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically predicts necessary medications based on symptoms and diagnosis.
        </p>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPatientId}
            onValueChange={(v) => {
              setSelectedPatientId(v)
              setPrescription([])
            }}
          >
            <SelectTrigger className="sm:w-[320px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {allPatients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {patient && diagnosis && (
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Badge variant="outline">{diagnosis.disease}</Badge>
              {patient.allergies.length > 0 && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertTriangle className="size-3 mr-1" />
                  Allergies: {patient.allergies.join(", ")}
                </Badge>
              )}
              <Badge variant="secondary">{patient.age}y, {patient.gender}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPatientId && (
        <div className="flex flex-col gap-6">
          {/* Current Prescription */}
          <div className="flex flex-col gap-4">
            {/* Interaction Warnings */}
            {warnings.length > 0 && (
              <Card className="border-destructive/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-destructive" />
                    <CardTitle className="text-base text-destructive">
                      Interaction Warnings
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1.5">
                    {warnings.map((w, i) => (
                      <p key={i} className="text-sm text-destructive">
                        {w}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dosage Calculator */}
            {patient && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-primary" />
                    <CardTitle className="text-base">Dosage Guidance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 grid-cols-2 text-sm">
                    <div className="rounded-md bg-muted/50 p-2.5">
                      <span className="text-muted-foreground">Patient Age</span>
                      <p className="font-medium font-mono">{patient.age} years</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2.5">
                      <span className="text-muted-foreground">Category</span>
                      <p className="font-medium">
                        {patient.age < 12 ? "Pediatric" : patient.age >= 65 ? "Geriatric" : "Adult"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {patient.age < 12
                      ? "Pediatric dosing: Adjust doses based on weight (mg/kg). Verify with pediatric formulary."
                      : patient.age >= 65
                        ? "Geriatric dosing: Consider renal function. Start with lower doses and titrate."
                        : "Standard adult dosing applies. Adjust for renal/hepatic impairment as needed."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Prescription Preview */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="size-4 text-primary" />
                    <CardTitle className="text-base text-primary">Predicted Prescription</CardTitle>
                  </div>
                  {isPredicting && <Loader2 className="size-4 animate-spin text-primary" />}
                </div>
                <CardDescription>
                  {prescription.length} medication{prescription.length !== 1 ? "s" : ""} generated by ML model
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prescription.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <Pill className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No medications added yet
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {prescription.map((item, i) => (
                      <div
                        key={item.medication}
                        className="flex items-center gap-3 rounded-md border p-2.5"
                      >
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{item.medication}</p>
                            {item.confidence !== undefined && (
                              <Badge variant="outline" className={`text-[10px] h-4 px-1 ${
                                item.confidence > 90 ? "text-emerald-600 border-emerald-200 bg-emerald-50" : 
                                item.confidence > 70 ? "text-amber-600 border-amber-200 bg-amber-50" : 
                                "text-slate-600 border-slate-200 bg-slate-50"
                              }`}>
                                {item.confidence}% Accuracy
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.dosage} | {item.frequency} | {item.duration}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => removeFromPrescription(item.medication)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <Button
                      className="w-full"
                      onClick={() =>
                        toast.success("Prescription saved and ready for printing")
                      }
                    >
                      <Printer className="size-4 mr-1" />
                      Generate Prescription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
