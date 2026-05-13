"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function DiseaseDistribution() {
  const [distribution, setDistribution] = useState<any[]>([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/records/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(records => {
        if (!Array.isArray(records) || records.length === 0) {
          return setDistribution([{ name: "No Data", value: 100 }])
        }

        const counts: Record<string, number> = {}
        records.forEach(r => {
          const disease = r.predicted_diagnosis || 'Unknown'
          counts[disease] = (counts[disease] || 0) + 1
        })

        const total = records.length
        const data = Object.entries(counts).map(([name, count]) => ({
          name,
          value: Math.round((count / total) * 100)
        })).sort((a, b) => b.value - a.value).slice(0, 5) // max 5 categories

        setDistribution(data)
      })
      .catch(err => {
        console.error("Failed to fetch records for distribution", err)
        setDistribution([{ name: "Error", value: 100 }])
      })
  }, [token])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Disease Distribution</CardTitle>
        <CardDescription>Current caseload breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {distribution.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                    color: "var(--color-foreground)",
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {distribution.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-muted-foreground truncate max-w-[100px]">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
