"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { IntakeFormData } from "@/app/(dashboard)/intake/page"

type Props = {
  formData: IntakeFormData
  updateFormData: (updates: Partial<IntakeFormData>) => void
}

export function PersonalInfoStep({ formData, updateFormData }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="Enter patient name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          placeholder="Years"
          value={formData.age}
          onChange={(e) => updateFormData({ age: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => updateFormData({ gender: value })}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bloodType">Blood Type</Label>
        <Select
          value={formData.bloodType}
          onValueChange={(value) => updateFormData({ bloodType: value })}
        >
          <SelectTrigger id="bloodType">
            <SelectValue placeholder="Select blood type" />
          </SelectTrigger>
          <SelectContent>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          placeholder="District / Region"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+xxx xxx xxx xxx"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea
          id="medicalHistory"
          placeholder="Previous conditions, surgeries, chronic illnesses..."
          value={formData.medicalHistory}
          onChange={(e) => updateFormData({ medicalHistory: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="allergies">Known Allergies</Label>
        <Input
          id="allergies"
          placeholder="e.g., Penicillin, Sulfa drugs (comma separated)"
          value={formData.allergies}
          onChange={(e) => updateFormData({ allergies: e.target.value })}
        />
      </div>
    </div>
  )
}
