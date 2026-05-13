"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { IntakeFormData } from "@/app/(dashboard)/intake/page"

type Props = {
  formData: IntakeFormData
  updateFormData: (updates: Partial<IntakeFormData>) => void
}

export function ReviewStep({ formData, updateFormData }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Personal Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{formData.name || "Not provided"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age / Gender</span>
            <span className="font-medium">
              {formData.age ? `${formData.age}y` : "N/A"}{formData.gender ? `, ${formData.gender}` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium">{formData.location || "Not provided"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Blood Type</span>
            <span className="font-medium">{formData.bloodType || "Not provided"}</span>
          </div>
          <div className="flex justify-between sm:col-span-2">
            <span className="text-muted-foreground">Medical History</span>
            <span className="font-medium text-right max-w-[60%]">{formData.medicalHistory || "None reported"}</span>
          </div>
          <div className="flex justify-between sm:col-span-2">
            <span className="text-muted-foreground">Allergies</span>
            <span className="font-medium">{formData.allergies || "None reported"}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Symptoms */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Symptoms ({formData.symptoms.length})
        </h3>
        {formData.symptoms.length === 0 ? (
          <p className="text-sm text-muted-foreground">No symptoms recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.symptoms.map((s) => (
              <Badge
                key={s.name}
                variant="outline"
                className={`${
                  s.severity >= 7
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : s.severity >= 4
                      ? "bg-warning/10 border-warning/30 text-warning-foreground"
                      : "bg-success/10 border-success/30 text-success-foreground"
                }`}
              >
                {s.name} ({s.severity}/10)
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Vitals */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Vital Parameters
        </h3>
        <div className="grid gap-2 sm:grid-cols-3 text-sm">
          {[
            { label: "Temperature", value: formData.temperature, unit: "°C" },
            { label: "Blood Pressure", value: formData.systolicBP && formData.diastolicBP ? `${formData.systolicBP}/${formData.diastolicBP}` : "", unit: "mmHg" },
            { label: "Heart Rate", value: formData.heartRate, unit: "bpm" },
            { label: "SpO2", value: formData.spO2, unit: "%" },
            { label: "Resp. Rate", value: formData.respiratoryRate, unit: "/min" },
          ].map((v) => (
            <div key={v.label} className="flex justify-between rounded-md bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">{v.label}</span>
              <span className="font-mono font-medium">
                {v.value ? `${v.value} ${v.unit}` : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Consent */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) =>
              updateFormData({ consent: checked === true })
            }
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
              Patient Consent for Data Processing
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I hereby consent to the collection, processing, and analysis of my health data by MediAssist AI
              for the purpose of clinical decision support and diagnosis. I understand that this data will be
              handled in compliance with applicable health data protection regulations and that I may withdraw
              my consent at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
