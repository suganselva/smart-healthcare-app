"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [offlineMode, setOfflineMode] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [diagnosisAlerts, setDiagnosisAlerts] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          System configuration and preferences
        </p>
      </div>

      {/* Clinic Profile */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <CardTitle className="text-base">Clinic Profile</CardTitle>
          </div>
          <CardDescription>Basic information about your healthcare facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input id="clinic-name" defaultValue="Kigali Rural Health Center" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-id">Facility ID</Label>
              <Input id="clinic-id" defaultValue="RHC-KGL-001" disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="region">Region</Label>
              <Select defaultValue="east-africa">
                <SelectTrigger id="region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="east-africa">East Africa</SelectItem>
                  <SelectItem value="west-africa">West Africa</SelectItem>
                  <SelectItem value="south-asia">South Asia</SelectItem>
                  <SelectItem value="southeast-asia">Southeast Asia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" size="sm" onClick={() => toast.success("Profile saved")}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Data & Sync */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <CardTitle className="text-base">Data & Sync</CardTitle>
          </div>
          <CardDescription>Offline mode and data synchronization settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Enable local data caching for areas with poor connectivity
                </p>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Sync</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync data when connection is restored
                </p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Last Sync</span>
                <p className="text-xs text-muted-foreground">
                  February 22, 2026 at 14:32 UTC
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Syncing data...")}>
                <RefreshCw className="size-3.5 mr-1" />
                Sync Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Patient Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Immediate alerts for critical patient conditions
                </p>
              </div>
              <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Diagnosis Completion</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when AI diagnosis results are ready
                </p>
              </div>
              <Switch checked={diagnosisAlerts} onCheckedChange={setDiagnosisAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send critical alerts via SMS (requires cellular network)
                </p>
              </div>
              <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-base">Security & Compliance</CardTitle>
          </div>
          <CardDescription>HIPAA compliance and data protection settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {[
              { label: "End-to-End Encryption", status: "Enabled", ok: true },
              { label: "HIPAA Compliance Mode", status: "Active", ok: true },
              { label: "Audit Trail Logging", status: "Active", ok: true },
              { label: "2FA Authentication", status: "Enabled", ok: true },
              { label: "Data Retention Policy", status: "7 years", ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <Key className="size-3.5 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    item.ok
                      ? "bg-success/10 text-success-foreground border-success/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            <CardTitle className="text-base">AI Model Configuration</CardTitle>
          </div>
          <CardDescription>Diagnosis engine settings and thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
              <Input id="confidence-threshold" type="number" defaultValue={60} min={0} max={100} />
              <p className="text-[11px] text-muted-foreground">
                Minimum confidence for direct treatment recommendation
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="referral-threshold">Referral Threshold (%)</Label>
              <Input id="referral-threshold" type="number" defaultValue={40} min={0} max={100} />
              <p className="text-[11px] text-muted-foreground">
                Below this threshold, auto-generate specialist referral
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model-version">Model Version</Label>
              <Select defaultValue="v3.2">
                <SelectTrigger id="model-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v3.2">MediAssist v3.2 (Latest)</SelectItem>
                  <SelectItem value="v3.1">MediAssist v3.1</SelectItem>
                  <SelectItem value="v3.0">MediAssist v3.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="disease-db">Disease Database</Label>
              <Select defaultValue="tropical">
                <SelectTrigger id="disease-db">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">Tropical & Infectious</SelectItem>
                  <SelectItem value="general">General Medicine</SelectItem>
                  <SelectItem value="pediatric">Pediatric</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" size="sm" onClick={() => toast.success("AI configuration updated")}>
            Update Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
