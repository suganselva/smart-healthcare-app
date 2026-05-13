"use client"

import { Users, Activity, AlertTriangle, Brain, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export function StatCards() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeCases: 0,
    criticalAlerts: 0,
    diagnosesToday: 0,
    referralsPending: 0,
    avgConfidence: 0,
  })

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
        let totalPatients = 0
        let activeCases = 0
        let criticalAlerts = 0
        let diagnosesToday = 0
        let referralsPending = 0
        let totalConfidence = 0
        let recordCount = 0

        const today = new Date().toDateString()

        if (Array.isArray(patientsData)) {
          totalPatients = patientsData.length
        }

        if (Array.isArray(recordsData)) {
          recordsData.forEach((record: any) => {
            const conf = parseFloat(record.confidence_score || "0")
            const confPercent = Math.round(conf * 100)
            totalConfidence += confPercent
            recordCount += 1
            
            if (conf >= 0.85) criticalAlerts += 1
            else if (conf <= 0.60) referralsPending += 1

            if (new Date(record.record_date).toDateString() === today) {
              diagnosesToday += 1
            }
          })
          
          activeCases = recordCount
        }

        const avgConf = recordCount > 0 ? Math.round(totalConfidence / recordCount) : 0

        setStats({
          totalPatients,
          activeCases,
          criticalAlerts,
          diagnosesToday,
          referralsPending,
          avgConfidence: avgConf,
        })
      })
      .catch(err => console.error("Failed to fetch dashboard stats", err))
  }, [token])

  const statItems = [
    {
      title: "Total Patients",
      value: stats.totalPatients,

      icon: Users,
      description: "Registered in system",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Cases",
      value: stats.activeCases,

      icon: Activity,
      description: "Currently under care",
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,

      icon: AlertTriangle,
      description: "Require attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Diagnoses Today",
      value: stats.diagnosesToday,

      icon: Brain,
      description: "AI-assisted",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Referrals",
      value: stats.referralsPending,

      icon: FileText,
      description: "Awaiting action",
      color: "text-warning-foreground",
      bgColor: "bg-warning/20",
    },
    {
      title: "Avg Confidence",
      value: `${stats.avgConfidence}%`,

      icon: TrendingUp,
      description: "Diagnosis accuracy",
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((stat) => (
        <Card key={stat.title} className="gap-0 py-4">
          <CardContent className="px-4 pb-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className={`rounded-md p-1.5 ${stat.bgColor}`}>
                <stat.icon className={`size-3.5 ${stat.color}`} />
              </div>

            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
