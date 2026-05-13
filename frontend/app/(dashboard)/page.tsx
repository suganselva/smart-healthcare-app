import { StatCards } from "@/components/dashboard/stat-cards"
import { DiagnosisChart } from "@/components/dashboard/diagnosis-chart"
import { DiseaseDistribution } from "@/components/dashboard/disease-distribution"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PatientOverview } from "@/components/dashboard/patient-overview"
import { AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Stats */}
      <StatCards />

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <DiagnosisChart />
        <DiseaseDistribution />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <PatientOverview />
      </div>

      {/* Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RecentActivity />
        {/* Compliance Card */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3">HIPAA Compliance Status</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Data Encryption", status: "Active", ok: true },
                { label: "Audit Trail Logging", status: "Active", ok: true },
                { label: "Access Controls", status: "Active", ok: true },
                { label: "Backup Status", status: "Last: 2h ago", ok: true },
                { label: "Consent Management", status: "Active", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${item.ok ? "text-success-foreground" : "text-destructive"}`}>
                    <span className={`size-1.5 rounded-full ${item.ok ? "bg-success" : "bg-destructive"}`} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold mb-1">Offline Sync Status</h3>
            <p className="text-xs text-muted-foreground mb-3">Last synced: 5 minutes ago</p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-full bg-success rounded-full" />
            </div>
            <p className="text-xs text-success-foreground mt-1.5 font-medium">Fully synchronized</p>
          </div>
        </div>
      </div>
    </div>
  )
}
