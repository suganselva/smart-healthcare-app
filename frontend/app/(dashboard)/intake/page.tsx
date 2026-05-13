"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { PersonalInfoStep } from "@/components/intake/personal-info-step"
import { SymptomsStep } from "@/components/intake/symptoms-step"
import { VitalsStep } from "@/components/intake/vitals-step"
import { ReviewStep } from "@/components/intake/review-step"

const steps = [
  { id: 1, title: "Personal Info", description: "Patient demographics" },
  { id: 2, title: "Symptoms", description: "Chief complaints" },
  { id: 3, title: "Vitals", description: "Vital parameters" },
  { id: 4, title: "Review", description: "Confirm & submit" },
]

export type IntakeFormData = {
  name: string
  age: string
  gender: string
  location: string
  phone: string
  medicalHistory: string
  allergies: string
  bloodType: string
  symptoms: { name: string; severity: number; duration: string }[]
  temperature: string
  systolicBP: string
  diastolicBP: string
  heartRate: string
  spO2: string
  respiratoryRate: string
  consent: boolean
}

const defaultFormData: IntakeFormData = {
  name: "",
  age: "",
  gender: "",
  location: "",
  phone: "",
  medicalHistory: "",
  allergies: "",
  bloodType: "",
  symptoms: [],
  temperature: "",
  systolicBP: "",
  diastolicBP: "",
  heartRate: "",
  spO2: "",
  respiratoryRate: "",
  consent: false,
}

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<IntakeFormData>(defaultFormData)
  const { token } = useAuth()

  const updateFormData = (updates: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      const toastId = toast.loading("Submitting patient intake...", {
        description: `Registering ${formData.name}...`,
      })

      // 1. Create Patient
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - (parseInt(formData.age) || 30));

      const patientPayload = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dob.toISOString().split("T")[0],
        gender: formData.gender || "Other",
        contact_number: formData.phone || null,
        address: formData.location || null
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const patientRes = await fetch(`${apiUrl}/api/v1/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(patientPayload)
      });

      if (!patientRes.ok) throw new Error("Failed to create patient");
      const patientData = await patientRes.json();

      // 2. Submit initial record/prediction for this new patient
      const vitals = {
        temperature: parseFloat(formData.temperature) || 37.0,   // Fix for strict float types if any
        systolicBP: parseInt(formData.systolicBP) || 120,
        diastolicBP: parseInt(formData.diastolicBP) || 80,
        heartRate: parseInt(formData.heartRate) || 72,
        spO2: parseInt(formData.spO2) || 98,
        respiratoryRate: parseInt(formData.respiratoryRate) || 16
      };

      const symptomsStr = formData.symptoms.map(s => `${s.name} (${s.severity}/10)`).join(", ");

      const activeVitals = Object.entries(vitals).filter(([_, v]) => v).length > 0;

      const recordPayload = {
        patient_id: patientData.id,
        symptoms: symptomsStr || "None reported",
        vitals: activeVitals ? vitals : null,
        doctor_notes: formData.medicalHistory
      };

      const recordRes = await fetch(`${apiUrl}/api/v1/predict/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(recordPayload)
      });

      if (!recordRes.ok) throw new Error("Failed to save diagnosis record");

      toast.success("Patient intake submitted successfully", {
        id: toastId,
        description: `${formData.name} has been registered. You can now view them in Diagnosis.`,
      })
      setCurrentStep(1)
      setFormData(defaultFormData)
    } catch (error: any) {
      toast.error("Error submitting intake", { description: error.message || "Please check backend connection." });
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${currentStep > step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                  }`}
              >
                {currentStep > step.id ? (
                  <Check className="size-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-none">{step.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${currentStep > step.id ? "bg-primary" : "bg-border"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <CardDescription>
            {currentStep === 1 && "Enter the patient's personal and demographic information."}
            {currentStep === 2 && "Record the patient's symptoms with severity ratings."}
            {currentStep === 3 && "Record the patient's vital parameters."}
            {currentStep === 4 && "Review all information before submitting."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <SymptomsStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <VitalsStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <ReviewStep formData={formData} updateFormData={updateFormData} />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>
        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}>
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!formData.consent}>
            <Send className="size-4 mr-1" />
            Submit Intake
          </Button>
        )}
      </div>
    </div>
  )
}
