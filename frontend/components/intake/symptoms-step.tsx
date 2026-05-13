"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Search } from "lucide-react"
import type { IntakeFormData } from "@/app/(dashboard)/intake/page"

type Props = {
  formData: IntakeFormData
  updateFormData: (updates: Partial<IntakeFormData>) => void
}

const commonSymptoms = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Vomiting",
  "Diarrhea", "Abdominal Pain", "Chest Pain", "Body Chills",
  "Joint Pain", "Dizziness", "Shortness of Breath", "Sore Throat",
  "Rash", "Night Sweats", "Weight Loss", "Blurred Vision",
  "Excessive Thirst", "Frequent Urination", "Numbness", "Swelling",
]

export function SymptomsStep({ formData, updateFormData }: Props) {
  const [search, setSearch] = useState("")
  const [newSymptom, setNewSymptom] = useState("")
  const [newSeverity, setNewSeverity] = useState(5)
  const [newDuration, setNewDuration] = useState("")

  const filtered = commonSymptoms.filter(
    (s) =>
      s.toLowerCase().includes(search.toLowerCase()) &&
      !formData.symptoms.some((fs) => fs.name === s)
  )

  const addSymptom = (name: string) => {
    updateFormData({
      symptoms: [
        ...formData.symptoms,
        { name, severity: newSeverity, duration: newDuration || "Not specified" },
      ],
    })
    setNewSymptom("")
    setNewSeverity(5)
    setNewDuration("")
  }

  const removeSymptom = (name: string) => {
    updateFormData({
      symptoms: formData.symptoms.filter((s) => s.name !== name),
    })
  }

  const updateSeverity = (name: string, severity: number) => {
    updateFormData({
      symptoms: formData.symptoms.map((s) =>
        s.name === name ? { ...s, severity } : s
      ),
    })
  }

  const severityColor = (severity: number) => {
    if (severity <= 3) return "bg-success text-success-foreground"
    if (severity <= 6) return "bg-warning text-warning-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  const severityLabel = (severity: number) => {
    if (severity <= 3) return "Mild"
    if (severity <= 6) return "Moderate"
    return "Severe"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Symptom Search */}
      <div className="flex flex-col gap-2">
        <Label>Search Common Symptoms</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search symptoms..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {filtered.slice(0, 8).map((symptom) => (
              <Badge
                key={symptom}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors"
                onClick={() => addSymptom(symptom)}
              >
                <Plus className="size-3 mr-1" />
                {symptom}
              </Badge>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground">No matching symptoms found. Add a custom symptom below.</p>
            )}
          </div>
        )}
      </div>

      {/* Custom Symptom */}
      <div className="flex flex-col gap-2">
        <Label>Add Custom Symptom</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Symptom name"
            value={newSymptom}
            onChange={(e) => setNewSymptom(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Duration"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="w-32"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => newSymptom && addSymptom(newSymptom)}
            disabled={!newSymptom}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Active Symptoms */}
      <div className="flex flex-col gap-2">
        <Label>
          Active Symptoms ({formData.symptoms.length})
        </Label>
        {formData.symptoms.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No symptoms added yet. Search above or add a custom symptom.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {formData.symptoms.map((symptom) => (
              <div
                key={symptom.name}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{symptom.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${severityColor(symptom.severity)}`}
                    >
                      {severityLabel(symptom.severity)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {symptom.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">
                      Severity: {symptom.severity}/10
                    </span>
                    <Slider
                      value={[symptom.severity]}
                      onValueChange={([val]) => updateSeverity(symptom.name, val)}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={() => removeSymptom(symptom.name)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
