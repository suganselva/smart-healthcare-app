"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
    id: number
    email: string
    full_name: string
    is_superuser: boolean
}

type AuthContextType = {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check local storage for token on mount
        const storedToken = localStorage.getItem("auth_token")
        if (storedToken) {
            setToken(storedToken)
            fetchUser(storedToken)
        } else {
            setIsLoading(false)
        }
    }, [])

    const fetchUser = async (authToken: string) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          const response = await fetch(`${apiUrl}/api/v1/users/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                // Token might be invalid or expired
                logout()
            }
        } catch (error) {
            console.error("Failed to fetch user:", error)
            logout()
        } finally {
            setIsLoading(false)
        }
    }

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("auth_token", newToken)
        setToken(newToken)
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem("auth_token")
        setToken(null)
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
