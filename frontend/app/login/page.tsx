"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Lock, Loader2, HeartPulse, Stethoscope, BrainCircuit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    // Find the input elements
    const emailInput = document.getElementById("email") as HTMLInputElement
    const passwordInput = document.getElementById("password") as HTMLInputElement

    formData.append("username", emailInput?.value || "")
    formData.append("password", passwordInput?.value || "")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/login/access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: emailInput?.value || "",
          password: passwordInput?.value || "",
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Fetch user data directly to populate auth context immediately
        const userResponse = await fetch(`${apiUrl}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`
          }
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          login(data.access_token, userData)
          router.push("/")
        } else {
          console.warn("Failed to fetch user after login")
        }
      } else {
        // Handle error (e.g., show toast)
        const errData = await response.json()
        alert(errData.detail || "Login failed - Invalid credentials.")
        console.warn("Login failed")
      }
    } catch (error) {
      console.warn("Login API error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      {/* Left Marketing Side */}
      <div className="hidden lg:flex w-[55%] border-r relative overflow-hidden flex-col items-center justify-center p-12 bg-primary/5">

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 flex flex-col max-w-lg">
          <Badge variant="outline" className="w-fit mb-6 bg-background">
            <Shield className="size-3.5 mr-1 text-success" />
            HIPAA Compliant System
          </Badge>

          <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8 shadow-xl">
            <HeartPulse className="size-8" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Next-Gen Clinical <br />
            <span className="text-primary">Decision Support</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Secure, intelligent healthcare management powered by advanced machine learning.
            Accelerate diagnosis, improve patient outcomes, and optimize clinical workflows.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 border shadow-sm backdrop-blur-sm">
              <BrainCircuit className="size-6 text-primary" />
              <h3 className="font-semibold">AI Diagnosis</h3>
              <p className="text-xs text-muted-foreground">Predictive models to assist clinical evaluations.</p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 border shadow-sm backdrop-blur-sm">
              <Stethoscope className="size-6 text-accent-foreground" />
              <h3 className="font-semibold">Smart Intake</h3>
              <p className="text-xs text-muted-foreground">Automated symptom and vital tracking systems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <HeartPulse className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MediAssist AI</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
            </div>
          </div>

          <Card className="border-0 shadow-none bg-transparent lg:border lg:shadow-xl lg:bg-card">
            <CardHeader className="space-y-2 px-0 lg:px-6 pt-0 lg:pt-6">
              <CardTitle className="text-2xl tracking-tight hidden lg:block">Welcome back</CardTitle>
              <CardDescription className="hidden lg:block text-base">
                Enter your clinical credentials to access the secure portal
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 px-0 lg:px-6">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="font-medium">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="doctor@hospital.org"
                      type="email"
                      className="pl-9 h-11 bg-muted/50 focus-visible:bg-transparent"
                      required
                      defaultValue="doctor@healthcare.com"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-medium">Password</Label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 h-11 bg-muted/50 focus-visible:bg-transparent"
                      required
                      defaultValue="Doctor123"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 mt-6 px-0 lg:px-6 pb-0 lg:pb-6">
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md transition-all hover:shadow-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Authenticating Server...
                    </>
                  ) : (
                    "Sign In Securely"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="size-3.5" />
                  <span>End-to-End Encrypted Login</span>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
