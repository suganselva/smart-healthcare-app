"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { patients as mockPatients, diagnoses as mockDiagnoses, type Patient, type Diagnosis } from "@/lib/mock-data"
import {
  Search,
  Heart,
  FileText,
  Download,
  Calendar,
  MapPin,
  Phone,
  Droplets,
  Activity,
  Thermometer,
  Wind,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"

const statusVariants: Record<string, string> = {
  Active: "bg-primary/10 text-primary border-primary/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Recovered: "bg-success/20 text-success-foreground border-success/20",
  "Follow-up": "bg-warning/20 text-warning-foreground border-warning/20",
}

function VitalCard({
  label,
  value,
  unit,
  icon: Icon,
  alert,
}: {
  label: string
  value: number
  unit: string
  icon: React.ElementType
  alert?: boolean
}) {
  return (
    <div className={`rounded-lg border p-3 ${alert ? "border-destructive/30 bg-destructive/5" : "bg-muted/30"}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`size-3.5 ${alert ? "text-destructive" : "text-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-lg font-bold font-mono ${alert ? "text-destructive" : ""}`}>
        {value}
        <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

function PatientDetail({
  patient,
  diagnosis,
  onBack,
}: {
  patient: Patient
  diagnosis?: Diagnosis
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="self-start -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="size-4 mr-1" />
        Back to Records
      </Button>

      {/* Patient Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusVariants[patient.status]}`}
                >
                  {patient.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{patient.age}y, {patient.gender}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {patient.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-3" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="size-3" />
                  Blood Type: {patient.bloodType}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Last Visit: {patient.lastVisit}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Generating patient report PDF...")}
            >
              <Download className="size-3.5 mr-1" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Medical History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {patient.medicalHistory.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <div className="size-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No prior medical history recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Allergies & Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive/20"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies</p>
                )}
              </CardContent>
            </Card>

            {/* Current Symptoms */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {patient.symptoms.map((symptom) => (
                    <div
                      key={symptom.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{symptom.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {symptom.duration} | Onset: {symptom.onset}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${symptom.severity * 6}px`,
                            backgroundColor:
                              symptom.severity >= 7
                                ? "var(--color-destructive)"
                                : symptom.severity >= 5
                                  ? "var(--color-warning)"
                                  : "var(--color-success)",
                          }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">
                          {symptom.severity}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Vital Signs</CardTitle>
              <CardDescription>Recorded on {patient.lastVisit}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
                <VitalCard
                  label="Temperature"
                  value={patient.vitals.temperature}
                  unit="°C"
                  icon={Thermometer}
                  alert={patient.vitals.temperature >= 38.5}
                />
                <VitalCard
                  label="Blood Pressure"
                  value={patient.vitals.systolicBP}
                  unit={`/${patient.vitals.diastolicBP} mmHg`}
                  icon={Activity}
                  alert={patient.vitals.systolicBP >= 140 || patient.vitals.diastolicBP >= 90}
                />
                <VitalCard
                  label="Heart Rate"
                  value={patient.vitals.heartRate}
                  unit="bpm"
                  icon={Heart}
                  alert={patient.vitals.heartRate >= 100}
                />
                <VitalCard
                  label="SpO2"
                  value={patient.vitals.spO2}
                  unit="%"
                  icon={Droplets}
                  alert={patient.vitals.spO2 < 95}
                />
                <VitalCard
                  label="Respiratory Rate"
                  value={patient.vitals.respiratoryRate}
                  unit="breaths/min"
                  icon={Wind}
                  alert={patient.vitals.respiratoryRate > 24}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="mt-4">
          {diagnosis ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">AI Diagnosis Result</CardTitle>
                  <CardDescription>{diagnosis.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl font-bold font-mono text-primary">
                      {diagnosis.confidence}%
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{diagnosis.disease}</p>
                      <Badge variant="secondary" className="text-xs capitalize mt-0.5">
                        {diagnosis.status}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {diagnosis.explanation}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recommended Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {diagnosis.recommendedTests.map((test) => (
                      <div key={test} className="flex items-center gap-2 text-sm rounded-md border p-2.5">
                        <FileText className="size-3.5 text-muted-foreground" />
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Treatment Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {diagnosis.treatment.map((item, i) => (
                      <div key={item} className="flex items-center gap-2 text-sm rounded-md border p-2.5">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <FileText className="size-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No diagnosis has been run for this patient yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Visit Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-border">
                <div className="mb-6 relative">
                  <div className="absolute -left-[25px] size-3 rounded-full bg-primary border-2 border-background" />
                  <p className="text-sm font-medium">{patient.lastVisit} - Current Visit</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Presented with {patient.symptoms.map((s) => s.name.toLowerCase()).join(", ")}.
                    {diagnosis && ` AI diagnosis: ${diagnosis.disease} (${diagnosis.confidence}% confidence).`}
                  </p>
                </div>
                {patient.medicalHistory.map((item, i) => (
                  <div key={item} className="mb-6 relative">
                    <div className="absolute -left-[25px] size-3 rounded-full bg-muted-foreground/30 border-2 border-background" />
                    <p className="text-sm font-medium">Previous Record</p>
                    <p className="text-xs text-muted-foreground mt-1">{item}</p>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[25px] size-3 rounded-full bg-muted border-2 border-background" />
                  <p className="text-sm font-medium text-muted-foreground">Patient Registered</p>
                  <p className="text-xs text-muted-foreground mt-1">Initial registration in MediAssist system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function RecordsPage() {
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const { token } = useAuth()
  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<Record<string, any>>({})
  const [dbDiagnoses, setDbDiagnoses] = useState<Record<string, Diagnosis>>({})

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
                    id: `diag-${rec.id}`,
                    patientId: p.id.toString(),
                    date: rec.record_date,
                    disease: rec.predicted_diagnosis || "Evaluation Required",
                    confidence: Math.round(parseFloat(rec.confidence_score || "0.6") * 100),
                    status: (parseFloat(rec.confidence_score || "0.6") > 0.8) ? "confirmed" : "pending",
                    explanation: `Based on the reported symptoms and vital signs, the ML prediction indicates ${rec.predicted_diagnosis}.`,
                    recommendedActions: ["Monitor vitals", "Clinical assessment required"],
                    recommendedTests: ["Complete Blood Count"],
                    treatment: rec.prescription ? [rec.prescription] : ["Follow clinical guidelines"],
                    shapValues: [],
                    alternativeDiagnoses: []
                  }
                }))
              }
            })
        })
      })
      .catch(err => console.error(err))
  }, [token])

  const mappedPatients: Patient[] = dbPatients.map(p => {
    const record = dbRecords[p.id]
    return {
      id: p.id.toString(),
      name: `${p.first_name}`,
      age: new Date().getFullYear() - new Date(p.date_of_birth).getFullYear(),
      gender: p.gender,
      location: p.address || "Unknown",
      phone: p.contact_number || "Unknown",
      medicalHistory: record?.doctor_notes ? [record.doctor_notes] : [],
      allergies: [],
      bloodType: "Unknown",
      lastVisit: record?.record_date || p.created_at || "Unknown",
      status: "Active",
      symptoms: record?.symptoms ? record.symptoms.split(",").map((s: string) => ({ name: s.trim().replace(/\(\d+\/10\)/, ''), severity: 5, duration: "2 days", onset: "Gradual" })) : [],
      vitals: record?.vitals || { temperature: 37, systolicBP: 120, diastolicBP: 80, heartRate: 72, spO2: 98, respiratoryRate: 16 }
    }
  })

  // Fallback to mock data if db empty
  const allPatients = mappedPatients.length > 0 ? mappedPatients : mockPatients;

  const filtered = allPatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (selectedPatient) {
    const diagnosis = dbDiagnoses[selectedPatient.id] || mockDiagnoses.find((d) => d.patientId === selectedPatient.id)
    return (
      <div className="p-4 lg:p-6">
        <PatientDetail
          patient={selectedPatient}
          diagnosis={diagnosis}
          onBack={() => setSelectedPatient(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Health Records</h1>
          <p className="text-sm text-muted-foreground">
            Complete patient database with EHR access
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {allPatients.length} patients
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "Active", "Critical", "Follow-up", "Recovered"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "all" ? "All" : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((patient) => {
          const diagnosis = dbDiagnoses[patient.id] || mockDiagnoses.find((d) => d.patientId === patient.id)
          return (
            <Card
              key={patient.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate">{patient.name}</h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 shrink-0 ${statusVariants[patient.status]}`}
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {patient.id} | {patient.age}y, {patient.gender}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="size-3" />
                      <span className="truncate">{patient.location}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">Diagnosis</span>
                    <span className="text-xs font-medium truncate max-w-[180px]">
                      {diagnosis ? diagnosis.disease : "Pending"}
                    </span>
                  </div>
                  {diagnosis && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`size-2 rounded-full ${
                          diagnosis.confidence >= 85
                            ? "bg-success"
                            : diagnosis.confidence >= 60
                              ? "bg-warning"
                              : "bg-destructive"
                        }`}
                      />
                      <span className="text-xs font-mono font-medium">
                        {diagnosis.confidence}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Symptom Chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {patient.symptoms.slice(0, 3).map((s) => (
                    <span
                      key={s.name}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {s.name}
                    </span>
                  ))}
                  {patient.symptoms.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      +{patient.symptoms.length - 3} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Search className="size-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No patients found matching your search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
