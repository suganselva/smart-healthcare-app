"use client"

import { useState, useEffect } from "react"
import { UserPlus, Brain, FileText, FlaskConical, Pill, CalendarCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
const activityIcons: Record<string, React.ElementType> = {
  intake: UserPlus,
  diagnosis: Brain,
  referral: FileText,
  lab: FlaskConical,
  prescription: Pill,
  followup: CalendarCheck,
}

const activityColors: Record<string, string> = {
  intake: "bg-primary/10 text-primary",
  diagnosis: "bg-chart-1/10 text-chart-1",
  referral: "bg-warning/20 text-warning-foreground",
  lab: "bg-accent/20 text-accent-foreground",
  prescription: "bg-chart-5/10 text-chart-5",
  followup: "bg-success/20 text-success-foreground",
}

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
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
        const recent: any[] = []
        
        if (Array.isArray(recordsData) && Array.isArray(patientsData)) {
          // Sort by date descending
          recordsData.sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
          
          recordsData.slice(0, 6).forEach(record => {
            const patient = patientsData.find(p => p.id === record.patient_id)
            const patientName = patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${record.patient_id}`
            
            const actionInfo = {
              action: `Diagnosis: ${record.predicted_diagnosis}`,
              patient: patientName,
              time: new Date(record.record_date).toLocaleDateString(),
              type: "diagnosis"
            }
            recent.push(actionInfo)
          })
        }
        
        setActivities(recent)
      })
      .catch(err => console.error("Failed to fetch recent activity", err))
  }, [token])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest clinical actions</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          {activities.length === 0 ? (
            <div className="text-center p-4 text-sm text-muted-foreground border rounded-lg border-dashed">
              No recent activity found.
            </div>
          ) : activities.map((item, i) => {
            const Icon = activityIcons[item.type] || Brain
            const colorClass = activityColors[item.type] || "bg-primary/10 text-primary"
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.patient}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {item.time}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
