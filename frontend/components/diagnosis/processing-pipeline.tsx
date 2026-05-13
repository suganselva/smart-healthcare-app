"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"

const pipelineSteps = [
  { id: 1, label: "Data Validation", description: "Verifying input completeness and format", delay: 0 },
  { id: 2, label: "Symptom Encoding", description: "Converting symptoms to feature vectors", delay: 600 },
  { id: 3, label: "Feature Scaling", description: "Normalizing vital parameters", delay: 1200 },
  { id: 4, label: "Model Inference", description: "Running ensemble classifier", delay: 1800 },
  { id: 5, label: "SHAP Analysis", description: "Computing feature attributions", delay: 2200 },
  { id: 6, label: "Result Generation", description: "Compiling prediction report", delay: 2600 },
]

export function ProcessingPipeline() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    pipelineSteps.forEach((step) => {
      setTimeout(() => {
        setActiveStep(step.id)
      }, step.delay)
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id])
        setActiveStep(step.id + 1)
      }, step.delay + 400)
    })
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">AI Processing Pipeline</CardTitle>
          <Badge variant="secondary" className="text-xs animate-pulse">
            Running...
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {pipelineSteps.map((step) => {
            const isCompleted = completedSteps.includes(step.id)
            const isActive = activeStep === step.id

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-md border p-3 transition-all ${
                  isCompleted
                    ? "border-success/30 bg-success/5"
                    : isActive
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-background"
                }`}
              >
                <div
                  className={`flex size-6 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" />
                  ) : isActive ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-bold">{step.id}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {isCompleted && (
                  <span className="text-[10px] font-medium text-success-foreground">
                    Complete
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
