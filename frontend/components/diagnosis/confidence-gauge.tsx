"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
  disease: string
  confidence: number
  status: string
}

export function ConfidenceGauge({ disease, confidence, status }: Props) {
  const circumference = 2 * Math.PI * 60
  const offset = circumference - (confidence / 100) * circumference

  const confidenceColor =
    confidence >= 85
      ? "text-success stroke-success"
      : confidence >= 60
        ? "text-warning stroke-warning"
        : "text-destructive stroke-destructive"

  const confidenceLabel =
    confidence >= 85 ? "High" : confidence >= 60 ? "Medium" : "Low"

  const confidenceBg =
    confidence >= 85
      ? "bg-success/10 text-success-foreground border-success/30"
      : confidence >= 60
        ? "bg-warning/10 text-warning-foreground border-warning/30"
        : "bg-destructive/10 text-destructive border-destructive/30"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Primary Prediction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="size-36 -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${confidenceColor} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold font-mono ${confidenceColor.split(" ")[0]}`}>
              {confidence}%
            </span>
            <span className="text-[10px] text-muted-foreground">Confidence</span>
          </div>
        </div>

        {/* Disease Name */}
        <h3 className="text-sm font-semibold text-center mt-3 text-balance leading-snug">
          {disease}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className={`text-xs ${confidenceBg}`}>
            {confidenceLabel} Confidence
          </Badge>
          <Badge variant="secondary" className="text-xs capitalize">
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
