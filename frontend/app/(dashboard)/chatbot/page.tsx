"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  ThermometerSun,
  Pill,
  Utensils,
  Shield,
  UserCircle,
} from "lucide-react"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const quickActions = [
  { label: "Patient Summary", icon: UserCircle, key: "summary" },
  { label: "Current Vitals", icon: ThermometerSun, key: "vitals" },
  { label: "AI Diagnosis", icon: Sparkles, key: "diagnosis" },
  { label: "Active Prescriptions", icon: Pill, key: "prescription" },
]

export default function ChatbotPage() {
  const { token } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am your MediAssist AI. You can select a patient above to discuss their specific records, or just ask me general health questions.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Patient Context State
  const [selectedPatientId, setSelectedPatientId] = useState<string>("general")
  const [dbPatients, setDbPatients] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<Record<string, any>>({})

  // Fetch Patients On Load
  useEffect(() => {
    if (!token) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/patients/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDbPatients(data)
        data.forEach((p: any) => {
          fetch(`${apiUrl}/api/v1/records/patient/${p.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(records => {
              if (records && records.length > 0) {
                setDbRecords(prev => ({ ...prev, [p.id]: records[0] }))
              }
            })
        })
      })
      .catch(err => console.error(err))
  }, [token])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const getSimulatedResponse = (text: string, patientContext: any, recordContext: any) => {
    const lower = text.toLowerCase()
    
    // Patient-Specific Logic
    if (patientContext) {
      if (lower.includes("summary") || lower.includes("who is")) {
        return `You are currently reviewing the file for ${patientContext.first_name}. They are a ${patientContext.gender} born on ${patientContext.date_of_birth}. Let me know if you want to see their vitals or diagnosis.`
      }
      if (lower.includes("vital") || lower.includes("heart rate") || lower.includes("blood pressure")) {
        if (!recordContext || !recordContext.vitals) return "I don't have any vitals recorded for this patient yet."
        const v = recordContext.vitals
        return `Here are ${patientContext.first_name}'s latest vitals:\n- Blood Pressure: ${v.systolicBP}/${v.diastolicBP} mmHg\n- Heart Rate: ${v.heartRate} bpm\n- Temperature: ${v.temperature}°C\n- SpO2: ${v.spO2}%`
      }
      if (lower.includes("diagnos") || lower.includes("disease") || lower.includes("what do they have")) {
        if (!recordContext || !recordContext.predicted_diagnosis) return "A diagnosis has not been run for this patient yet."
        return `Based on their reported symptoms (${recordContext.symptoms}), our ML model predicts **${recordContext.predicted_diagnosis}** with ${(parseFloat(recordContext.confidence_score)*100).toFixed(0)}% confidence.`
      }
      if (lower.includes("prescrip") || lower.includes("medic") || lower.includes("drug") || lower.includes("treatment")) {
        if (!recordContext || !recordContext.prescription) return "I don't have an active prescription mapped for this patient. Please run a diagnosis first."
        return `Based on the system's analysis, the recommended treatment plan for ${patientContext.first_name} is:\n\n**${recordContext.prescription}**.`
      }
      if (lower.includes("symptom") || lower.includes("complain")) {
        if (!recordContext) return "No symptoms reported."
        return `${patientContext.first_name} presented with the following symptoms: ${recordContext.symptoms}. Doctor's notes: ${recordContext.doctor_notes || 'None'}.`
      }
    }

    // General Fallbacks
    if (lower.includes("prevent") || lower.includes("healthy") || lower.includes("hygiene")) {
      return "General hygiene, a balanced diet, regular exercise, and adequate sleep are foundational for preventing common illnesses. Do you want tips for a specific disease?"
    }
    if (lower.includes("diet") || lower.includes("food") || lower.includes("nutri") || lower.includes("eat")) {
      return "A healthy diet involves balancing macronutrients, drinking plenty of water, and minimizing highly processed foods. Are you looking for diet tips for a specific patient?"
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello! I am your AI-powered companion. Select a patient context from the top left, or ask me general medical questions!"
    }
    
    return patientContext 
      ? `I'm tracking ${patientContext.first_name}'s profile, but I'm not sure how to answer that specific question. Try asking about their 'diagnosis', 'vitals', or 'prescription'.`
      : "I'm a simulated AI assistant without a live model connected. I can answer basic medical questions or give you specific details about patients if you select one above!"
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Context resolution
    const activePatient = selectedPatientId === "general" ? null : dbPatients.find(p => p.id.toString() === selectedPatientId)
    const activeRecord = activePatient ? dbRecords[activePatient.id] : null

    // Simulate AI response delay
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(text, activePatient, activeRecord),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 800 + Math.random() * 500)
  }

  return (
    <div className="flex flex-col p-4 lg:p-6 min-h-[calc(100vh-3.5rem)]">
      <div className="grid gap-6 flex-1 lg:grid-cols-[1fr_280px]">
        {/* Chat Area */}
        <Card className="flex flex-col min-h-[500px] overflow-hidden shadow-md">
          <CardHeader className="pb-3 shrink-0 border-b bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Bot className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center justify-between">
                  MediAssist Smart Chat
                  <Badge variant="secondary" className="bg-success/10 text-success-foreground text-xs shadow-sm">
                    <span className="size-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
                    Online
                  </Badge>
                </CardTitle>
                
                {/* Patient Context Selector */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Context:</span>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger className="h-7 text-xs sm:w-[220px]">
                      <SelectValue placeholder="General Chat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general" className="font-semibold text-primary">Global Assistant (No Patient)</SelectItem>
                      {dbPatients.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.first_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4 bg-muted/10" ref={scrollRef}>
            <div className="flex flex-col gap-5 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === "user" ? "flex-row-reverse self-end" : "self-start"
                  }`}
                >
                  <Avatar className="size-8 shrink-0 shadow-sm">
                    <AvatarFallback
                      className={
                        msg.role === "assistant"
                          ? "bg-primary/20 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="size-4" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-background border rounded-tl-sm"
                    }`}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 && line.trim() ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%] self-start">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary border border-primary/20">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-background border rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="size-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="size-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3 shrink-0 bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex gap-2 relative"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedPatientId === "general" ? "Ask a general medical question..." : "Ask about this patient's vitals, diagnosis, or prescriptions..."}
                disabled={isTyping}
                className="pr-12 shadow-sm focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                size="sm"
                variant="default"
                disabled={!input.trim() || isTyping}
                className="absolute right-1 top-1 bottom-1 h-auto"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-4 overflow-y-auto">
          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Contextual Actions</CardTitle>
              <CardDescription className="text-xs">Ask quick questions about the active patient.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.key}
                    variant="outline"
                    className="justify-start text-sm h-9 hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={() => sendMessage(action.label)}
                    disabled={selectedPatientId === "general"}
                  >
                    <action.icon className="size-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
                {selectedPatientId === "general" && (
                  <p className="text-[10px] text-muted-foreground mt-1 text-center italic">
                    Select a patient to use quick actions.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card className="shadow-sm bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <CardTitle className="text-sm text-primary">Engine Upgraded!</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MessageCircle className="size-3 shrink-0 mt-0.5" />
                  Context-aware patient tracking
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="size-3 shrink-0 mt-0.5" />
                  Live database record lookups
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="size-3 shrink-0 mt-0.5" />
                  Answers regarding AI Prescriptions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
