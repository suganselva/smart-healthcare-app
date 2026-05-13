"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = {
  alternatives: { disease: string; confidence: number }[]
}

export function AlternativeDiagnoses({ alternatives }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Alternative Diagnoses</CardTitle>
        <CardDescription>Other possible conditions ranked by probability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {alternatives.map((alt, i) => (
            <div key={alt.disease} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {i + 1}. {alt.disease}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {alt.confidence}%
                </span>
              </div>
              <Progress
                value={alt.confidence}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
