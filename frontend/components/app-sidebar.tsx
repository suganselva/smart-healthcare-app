"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  UserPlus,
  Brain,
  FileText,
  MessageCircle,
  Settings,
  Heart,
  Shield,
  Pill,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const mainNav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Patient Intake", href: "/intake", icon: UserPlus },
  { title: "Diagnosis Engine", href: "/diagnosis", icon: Brain },
  { title: "Referrals", href: "/referrals", icon: FileText },
  { title: "Prescriptions", href: "/prescriptions", icon: Pill },
  { title: "Health Records", href: "/records", icon: Heart },
]

const secondaryNav = [
  { title: "Chatbot", href: "/chatbot", icon: MessageCircle },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">MediAssist AI</span>
                  <span className="text-xs text-muted-foreground">
                    Smart Healthcare
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clinical</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.title === "Diagnosis Engine" && (
                        <Badge
                          variant="secondary"
                          className="ml-auto bg-primary/10 text-primary text-[10px] px-1.5 py-0"
                        >
                          AI
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-2 py-2 w-full text-sm mt-auto border-t pt-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary font-medium uppercase">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col flex-1 overflow-hidden" title={user.email}>
                  <span className="font-medium truncate">{user.full_name || "Doctor"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={logout} className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive text-sm font-medium">
              Log Out
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-4">
            <SidebarMenuButton size="sm" className="text-xs text-muted-foreground">
              <div className="size-2 rounded-full bg-success animate-pulse" />
              <span>System Online</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
