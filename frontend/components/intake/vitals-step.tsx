"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Thermometer, Heart, Activity, Wind } from "lucide-react"
import type { IntakeFormData } from "@/app/(dashboard)/intake/page"

type Props = {
  formData: IntakeFormData
  updateFormData: (updates: Partial<IntakeFormData>) => void
}

const vitalFields = [
  {
    id: "temperature",
    label: "Temperature",
    unit: "°C",
    placeholder: "36.5",
    icon: Thermometer,
    normalRange: "36.1 - 37.2°C",
  },
  {
    id: "systolicBP",
    label: "Systolic BP",
    unit: "mmHg",
    placeholder: "120",
    icon: Activity,
    normalRange: "90 - 120 mmHg",
  },
  {
    id: "diastolicBP",
    label: "Diastolic BP",
    unit: "mmHg",
    placeholder: "80",
    icon: Activity,
    normalRange: "60 - 80 mmHg",
  },
  {
    id: "heartRate",
    label: "Heart Rate",
    unit: "bpm",
    placeholder: "72",
    icon: Heart,
    normalRange: "60 - 100 bpm",
  },
  {
    id: "spO2",
    label: "SpO2",
    unit: "%",
    placeholder: "98",
    icon: Wind,
    normalRange: "95 - 100%",
  },
  {
    id: "respiratoryRate",
    label: "Respiratory Rate",
    unit: "breaths/min",
    placeholder: "16",
    icon: Wind,
    normalRange: "12 - 20 breaths/min",
  },
]

function getVitalStatus(id: string, value: string): "normal" | "warning" | "critical" | "empty" {
  if (!value) return "empty"
  const v = parseFloat(value)
  if (isNaN(v)) return "empty"

  switch (id) {
    case "temperature":
      if (v >= 36.1 && v <= 37.2) return "normal"
      if (v > 37.2 && v <= 38.5) return "warning"
      return "critical"
    case "systolicBP":
      if (v >= 90 && v <= 120) return "normal"
      if (v > 120 && v <= 140) return "warning"
      return "critical"
    case "diastolicBP":
      if (v >= 60 && v <= 80) return "normal"
      if (v > 80 && v <= 90) return "warning"
      return "critical"
    case "heartRate":
      if (v >= 60 && v <= 100) return "normal"
      if ((v >= 50 && v < 60) || (v > 100 && v <= 120)) return "warning"
      return "critical"
    case "spO2":
      if (v >= 95) return "normal"
      if (v >= 90 && v < 95) return "warning"
      return "critical"
    case "respiratoryRate":
      if (v >= 12 && v <= 20) return "normal"
      if ((v >= 10 && v < 12) || (v > 20 && v <= 25)) return "warning"
      return "critical"
    default:
      return "normal"
  }
}

const statusColors = {
  normal: "border-success/50 bg-success/5",
  warning: "border-warning/50 bg-warning/5",
  critical: "border-destructive/50 bg-destructive/5",
  empty: "",
}

const statusLabels = {
  normal: "Normal",
  warning: "Elevated",
  critical: "Critical",
  empty: "",
}

const statusTextColors = {
  normal: "text-success-foreground",
  warning: "text-warning-foreground",
  critical: "text-destructive",
  empty: "text-muted-foreground",
}

export function VitalsStep({ formData, updateFormData }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vitalFields.map((field) => {
        const value = formData[field.id as keyof IntakeFormData] as string
        const status = getVitalStatus(field.id, value)
        return (
          <div
            key={field.id}
            className={`flex flex-col gap-2 rounded-lg border p-4 transition-colors ${statusColors[status]}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <field.icon className="size-4 text-muted-foreground" />
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                </Label>
              </div>
              {status !== "empty" && (
                <span className={`text-[10px] font-semibold ${statusTextColors[status]}`}>
                  {statusLabels[status]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                id={field.id}
                type="number"
                step="0.1"
                placeholder={field.placeholder}
                value={value}
                onChange={(e) =>
                  updateFormData({ [field.id]: e.target.value })
                }
                className="font-mono text-lg"
              />
              <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
                {field.unit}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Normal: {field.normalRange}
            </p>
          </div>
        )
      })}
    </div>
  )
}
