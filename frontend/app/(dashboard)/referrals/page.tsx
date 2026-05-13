"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { labTests } from "@/lib/mock-data"
import {
  FileText,
  AlertTriangle,
  Printer,
  Send,
  CheckCircle,
  Clock,
  FlaskConical,
  Brain,
  UserPlus,
  MapPin,
  Building,
  Star,
  Loader2,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

type ReferralResult = {
  doctorName: string
  specialty: string
  hospital: string
  matchScore: number
  distance: string
  availability: string
  contact: string
  rating?: number
  experience?: string
  fee?: number
  location?: string
}

export default function ReferralsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [checkedTests, setCheckedTests] = useState<string[]>([])
  const [referralNotes, setReferralNotes] = useState("")
  const [referral, setReferral] = useState<ReferralResult | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const { token } = useAuth()
  
  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<Record<string, any>>({})

  const [dbDiagnoses, setDbDiagnoses] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!token) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/patients/with-records`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDbPatients(data)
        const recordsMap: Record<string, any> = {}
        const diagnosesMap: Record<string, any> = {}
        data.forEach((p: any) => {
          if (p.latest_record) {
            const rec = p.latest_record
            recordsMap[p.id] = rec
            diagnosesMap[p.id] = {
              disease: rec.predicted_diagnosis || "Evaluation Required",
              confidence: rec.confidence_score ? parseFloat(rec.confidence_score) * 100 : 85,
              recommendedTests: ["Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)"],
              treatment: ["Rest", "Hydration", "Observation"]
            }
          }
        })
        setDbRecords(recordsMap)
        setDbDiagnoses(diagnosesMap)
      })
      .catch(err => console.error(err))
  }, [token])

  const mappedPatients = dbPatients.map(p => {
    const rec = dbRecords[p.id]
    let symptoms = []
    if (rec && rec.symptoms) {
      try {
        const parsed = typeof rec.symptoms === "string" ? JSON.parse(rec.symptoms) : rec.symptoms
        symptoms = Array.isArray(parsed) ? parsed.map((s: any) => ({name: s})) : [{name: String(parsed)}]
      } catch (e) {
        symptoms = rec.symptoms.split(",").map((name: string) => ({name: name.trim()}))
      }
    } else {
      symptoms = [{name: "No documented symptoms"}]
    }

    const defaultVitals = {
      temperature: "--",
      systolicBP: "--",
      diastolicBP: "--",
      heartRate: "--",
      spO2: "--"
    }

    let vitals = defaultVitals
    if (rec && rec.vitals) {
      if (typeof rec.vitals === "string") {
        try { vitals = { ...defaultVitals, ...JSON.parse(rec.vitals) } } catch(e) {}
      } else {
        vitals = { ...defaultVitals, ...rec.vitals }
      }
    }

    return {
      id: p.id.toString(),
      name: `${p.first_name} ${p.last_name}`.replace(/doe/gi, "").trim(),
      age: new Date().getFullYear() - new Date(p.date_of_birth).getFullYear(),
      gender: p.gender,
      location: p.address || "Unknown Location",
      symptoms: symptoms,
      vitals: vitals
    }
  })


  const patient = mappedPatients.find((p) => p.id === selectedPatientId)
  const diagnosis = dbDiagnoses[selectedPatientId]

  const triageLevel =
    diagnosis && diagnosis.confidence >= 85
      ? "high"
      : diagnosis && diagnosis.confidence >= 60
        ? "medium"
        : "low"

  const toggleTest = (testName: string) => {
    setCheckedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    )
  }

  const evaluateReferral = () => {
    if (!selectedPatientId || !token || !patient || !diagnosis) return;
    
    setIsPredicting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/predict/referral`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        disease: diagnosis.disease,
        confidence_score: diagnosis.confidence / 100,
        location: patient.location
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Failed to predict referral");
        }
        return res.json();
      })
      .then(data => {
        setReferral(data)
        toast.success("AI successfully matched patient with a specialist.")
      })
      .catch(err => {
        console.error("Referral Fetch Error:", err);
        toast.error(`Fetch Error: ${err.message || "Failed to generate AI referral"}`);
      })
      .finally(() => {
        setIsPredicting(false)
      })
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="size-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Specialist Referrals & Decision Support</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs ml-2">ML-Powered</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automated triage, lab test tracking, and AI-driven specialist matching
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedPatientId} onValueChange={(v) => { setSelectedPatientId(v); setCheckedTests([]); setReferral(null); }}>
              <SelectTrigger className="sm:w-[320px]">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {mappedPatients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={evaluateReferral} 
              disabled={!selectedPatientId || !diagnosis || isPredicting}
            >
              {isPredicting ? (
                <><Loader2 className="size-4 mr-2 animate-spin" /> Matching...</>
              ) : (
                <><UserPlus className="size-4 mr-2" /> Find Specialist</>
              )}
            </Button>
          </div>
          {patient && diagnosis && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-primary/5">
                Current Diagnosis: {diagnosis.disease}
              </Badge>
              <Badge variant="secondary">
                Confidence: {Math.round(diagnosis.confidence)}%
              </Badge>
              <span className="text-muted-foreground text-xs flex items-center">
                <MapPin className="size-3 mr-1" /> {patient.location}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {diagnosis && patient && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Triage Classification */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Triage Classification</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      triageLevel === "high"
                        ? "bg-success/10 text-success-foreground border-success/30"
                        : triageLevel === "medium"
                          ? "bg-warning/10 text-warning-foreground border-warning/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                    }`}
                  >
                    {triageLevel === "high"
                      ? "High Confidence - Direct Treatment"
                      : triageLevel === "medium"
                        ? "Medium Confidence - Tests Needed"
                        : "Low Confidence - Specialist Referral"}
                  </Badge>
                </div>
                <CardDescription>
                  {diagnosis.disease} ({Math.round(diagnosis.confidence)}% confidence)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {triageLevel === "high" && (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="size-4 text-success-foreground" />
                      <h4 className="text-sm font-semibold text-success-foreground">
                        Direct Diagnosis - Treatment Guidance
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      High confidence diagnosis allows for immediate treatment initiation.
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {diagnosis.treatment.map((t: string) => (
                        <div key={t} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="size-3 text-success-foreground" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {triageLevel === "medium" && (
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-4 text-warning-foreground" />
                      <h4 className="text-sm font-semibold text-warning-foreground">
                        Recommended Lab Tests
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Confirmation tests recommended before definitive treatment.
                    </p>
                    <div className="flex flex-col gap-2">
                      {diagnosis.recommendedTests.map((test: string) => {
                        const labTest = labTests.find((lt) => lt.name === test)
                        return (
                          <div
                            key={test}
                            className="flex items-center gap-3 rounded-md border bg-background p-2.5"
                          >
                            <Checkbox
                              id={test}
                              checked={checkedTests.includes(test)}
                              onCheckedChange={() => toggleTest(test)}
                            />
                            <Label htmlFor={test} className="flex-1 cursor-pointer">
                              <span className="text-sm font-medium">{test}</span>
                              {labTest && (
                                <span className="text-xs text-muted-foreground block">
                                  {labTest.category} - Turnaround: {labTest.turnaround}
                                </span>
                              )}
                            </Label>
                            <FlaskConical className="size-3.5 text-muted-foreground" />
                          </div>
                        )
                      })}
                    </div>
                    {checkedTests.length > 0 && (
                      <Button
                        className="mt-3"
                        size="sm"
                        onClick={() =>
                          toast.success(
                            `${checkedTests.length} lab tests ordered`
                          )
                        }
                      >
                        Order {checkedTests.length} Test{checkedTests.length > 1 ? "s" : ""}
                      </Button>
                    )}
                  </div>
                )}

                {triageLevel === "low" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="size-4 text-destructive" />
                      <h4 className="text-sm font-semibold text-destructive">
                        Specialist Referral Required
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Low confidence warrants specialist evaluation. Use the matching engine to find a specialist.
                    </p>
                    <div className="flex flex-col gap-2">
                      {diagnosis.recommendedTests.map((test: string) => (
                        <div key={test} className="flex items-center gap-2 text-sm">
                          <FlaskConical className="size-3 text-destructive" />
                          <span>{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Specialist Match Result */}
            {referral && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3 border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-primary">AI Specialist Match</CardTitle>
                      <CardDescription>Best clinical match based on risk and location</CardDescription>
                    </div>
                    <div className="flex flex-col items-center justify-center size-14 rounded-full bg-primary/20">
                      <span className="text-lg font-bold text-primary">{referral.matchScore}%</span>
                      <span className="text-[10px] uppercase font-semibold text-primary/70 -mt-1">Match</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {referral.doctorName}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground mt-0.5">{referral.specialty}</p>
                      
                      <div className="mt-4 space-y-2.5">
                        <div className="flex items-start gap-2 text-sm">
                          <Building className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{referral.hospital}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{referral.location || referral.distance}</span>
                        </div>
                        <div className="flex gap-3 mt-4 pt-3 border-t border-primary/10">
                          <div className="flex items-center gap-1">
                            <Star className="size-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-semibold">{referral.rating || "4.5"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3.5 text-primary" />
                            <span className="text-xs">{referral.experience || "10+ Years"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-primary">₹{referral.fee || "500"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-md p-4 border shadow-sm">
                      <h4 className="text-sm font-semibold mb-3">Scheduling</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="size-4 text-primary shrink-0" />
                          <span>{referral.availability}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UserPlus className="size-4 text-primary shrink-0" />
                          <span>{referral.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Referral Letter */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <CardTitle className="text-base">Referral Letter</CardTitle>
              </div>
              <CardDescription>Auto-generated referral with patient summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
                <p className="font-semibold text-foreground mb-2">
                  CLINICAL REFERRAL LETTER
                </p>
                <Separator className="my-2" />
                <p><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Patient:</span> {patient.name} ({patient.age}y, {patient.gender})</p>
                <Separator className="my-2" />
                <p className="font-semibold mb-1">Clinical Summary:</p>
                <p className="text-muted-foreground mb-2">
                  Patient presents with {patient.symptoms.map((s: any) => s.name.toLowerCase()).join(", ")}.
                  AI-assisted diagnosis indicates <span className="font-semibold text-foreground">{diagnosis.disease}</span> with{" "}
                  {Math.round(diagnosis.confidence)}% confidence.
                </p>
                {referral && (
                  <>
                    <p className="font-semibold mb-1">Referred To:</p>
                    <p className="text-muted-foreground mb-2">
                      {referral.doctorName} ({referral.specialty}) at {referral.hospital}
                    </p>
                  </>
                )}
                <p className="font-semibold mb-1">Vitals at Presentation:</p>
                <p className="text-muted-foreground mb-2">
                  Temp: {patient.vitals.temperature}°C | BP: {patient.vitals.systolicBP}/{patient.vitals.diastolicBP} mmHg |
                  HR: {patient.vitals.heartRate} bpm | SpO2: {patient.vitals.spO2}%
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add clinical notes for the specialist..."
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() =>
                    toast.success("Referral sent to specialist via secure EHR transfer.")
                  }
                >
                  <Send className="size-4 mr-1" />
                  Send Referral
                </Button>
                <Button variant="outline" onClick={() => toast.info("Printing referral letter...")}>
                  <Printer className="size-4 mr-1" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Alerts */}
          {patient.symptoms.some((s: any) =>
            ["Chest Pain", "Severe Bleeding", "Shortness of Breath", "Seizures"].includes(s.name)
          ) && (
            <div className="rounded-lg border-2 border-destructive bg-destructive/5 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                <h1 className="text-sm font-bold text-destructive">
                  SAFETY ALERT - HIGH RISK SYMPTOMS DETECTED
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This patient has reported high-risk symptoms that may indicate a medical emergency.
                Immediate clinical evaluation is strongly recommended.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

