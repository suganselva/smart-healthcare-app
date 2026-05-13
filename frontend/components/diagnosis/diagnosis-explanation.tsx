"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FlaskConical, Stethoscope } from "lucide-react"
import type { Diagnosis, Patient } from "@/lib/mock-data"

type Props = {
  diagnosis: Diagnosis
  patient: Patient
}

export function DiagnosisExplanation({ diagnosis, patient }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Why This Prediction */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-warning" />
            <CardTitle className="text-base">Why This Prediction?</CardTitle>
          </div>
          <CardDescription>Natural language explanation of key factors</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {diagnosis.explanation}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Key Contributing Factors
            </h4>
            {diagnosis.shapValues.slice(0, 3).map((sv) => (
              <div key={sv.symptom} className="flex items-center gap-2 text-sm">
                <div className="size-1.5 rounded-full bg-primary" />
                <span className="font-medium">{sv.symptom}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  ({Math.round(sv.contribution * 100)}% influence)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tests & Treatment */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-primary" />
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </div>
          <CardDescription>Lab tests and initial treatment plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Lab Tests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {diagnosis.recommendedTests.map((test) => (
                  <Badge
                    key={test}
                    variant="outline"
                    className="text-xs bg-primary/5 border-primary/20"
                  >
                    <FlaskConical className="size-3 mr-1" />
                    {test}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Treatment Plan
              </h4>
              <div className="flex flex-col gap-1.5">
                {diagnosis.treatment.map((t, i) => (
                  <div key={t} className="flex items-center gap-2 text-sm">
                    <Stethoscope className="size-3 text-accent-foreground shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {patient.allergies.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs font-semibold text-destructive mb-1">Allergy Alert</p>
                <p className="text-xs text-muted-foreground">
                  Patient has known allergies to: {patient.allergies.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
