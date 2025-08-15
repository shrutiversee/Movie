"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "./api-client"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
      if (storedToken) {
        apiClient.setToken(storedToken)

        const response = await apiClient.getProfile()
        setUser({
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
        })
      } else {
        apiClient.setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Clear invalid token
      apiClient.setToken(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      setUser({
        id: response.user._id,
        email: response.user.email,
        name: response.user.name,
      })
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register(email, password, name)
      setUser({
        id: response.user._id,
        email: response.user.email,
        name: response.user.name,
      })
    } catch (error: any) {
      throw new Error(error.message || "Registration failed")
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
      apiClient.setToken(null)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
