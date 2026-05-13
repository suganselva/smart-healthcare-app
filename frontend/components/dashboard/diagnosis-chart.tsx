"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export function DiagnosisChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/records/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(records => {
      if (!Array.isArray(records)) return
      
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const template = days.map(day => ({
        day, malaria: 0, typhoid: 0, diabetes: 0, hypertension: 0, other: 0
      }))

      records.forEach((r: any) => {
        const d = new Date(r.record_date);
        const dayName = days[d.getDay()];
        const target = template.find(t => t.day === dayName);
        if (target) {
          const diag = (r.predicted_diagnosis || "").toLowerCase();
          if (diag.includes("malaria")) target.malaria++;
          else if (diag.includes("typhoid")) target.typhoid++;
          else if (diag.includes("diabetes")) target.diabetes++;
          else if (diag.includes("hypertension")) target.hypertension++;
          else target.other++;
        }
      })
      
      const todayIdx = new Date().getDay();
      const past7 = [];
      for (let i = 6; i >= 0; i--) {
        const idx = (todayIdx - i + 7) % 7;
        past7.push(template[idx]);
      }
      setChartData(past7);
    }).catch(err => console.error("Chart fetch error", err))
  }, [token])

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Diagnoses</CardTitle>
        <CardDescription>Disease distribution over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pr-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
                color: "var(--color-foreground)",
              }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="malaria" name="Malaria" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="typhoid" name="Typhoid" fill="var(--color-chart-2)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="diabetes" name="Diabetes" fill="var(--color-chart-3)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="hypertension" name="Hypertension" fill="var(--color-chart-4)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="other" name="Other" fill="var(--color-chart-5)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
