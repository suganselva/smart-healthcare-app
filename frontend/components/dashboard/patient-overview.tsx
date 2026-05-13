"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"

const statusVariants: Record<string, string> = {
  Active: "bg-primary/10 text-primary border-primary/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Recovered: "bg-success/20 text-success-foreground border-success/20",
  "Follow-up": "bg-warning/20 text-warning-foreground border-warning/20",
}

export function PatientOverview() {
  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<any[]>([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    Promise.all([
      fetch(`${apiUrl}/api/v1/patients/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${apiUrl}/api/v1/records/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([patientsData, recordsData]) => {
        if (Array.isArray(patientsData)) setDbPatients(patientsData.reverse().slice(0, 5))
        if (Array.isArray(recordsData)) setDbRecords(recordsData)
      })
      .catch(err => console.error("Failed to fetch overview data", err))
  }, [token])

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Patient Overview</CardTitle>
          <CardDescription>Recent patients and their diagnosis status</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/records">
            View all <ArrowRight className="ml-1 size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          {dbPatients.length === 0 ? (
            <div className="text-center p-4 text-sm text-muted-foreground border rounded-lg border-dashed">
              No recent patients. Add a patient via Patient Intake.
            </div>
          ) : dbPatients.map((patient) => {
            const record = dbRecords.find((d) => d.patient_id === patient.id)
            const confidenceScore = record ? Math.round(parseFloat(record.confidence_score || "0.6") * 100) : 0

            let statusBadge = "Active"
            if (confidenceScore >= 85) statusBadge = "Critical"
            else if (confidenceScore >= 70) statusBadge = "Follow-up"

            return (
              <div
                key={patient.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                    {patient.first_name?.[0]}{patient.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{patient.first_name} {patient.last_name}</p>
                    {record && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${statusVariants[statusBadge] || statusVariants["Active"]}`}
                      >
                        {statusBadge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}y, {patient.gender} &middot; {patient.address || 'Unknown'}
                  </p>
                </div>
                {record && (
                  <div className="hidden sm:flex flex-col items-end gap-0.5">
                    <p className="text-xs font-medium truncate max-w-[160px]">
                      {record.predicted_diagnosis}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`size-1.5 rounded-full ${confidenceScore >= 85
                          ? "bg-destructive"
                          : confidenceScore >= 60
                            ? "bg-warning"
                            : "bg-success"
                          }`}
                      />
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {confidenceScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
