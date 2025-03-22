"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useAxios } from "../hooks/useAxios"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { axiosInstance } = useAxios()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken")

        if (token) {
          // Validate token and get user data
          const response = await axiosInstance.get("/api/auth/me")
          setUser(response.data.user)
        }
      } catch (error) {
        // Token might be invalid, clear it
        localStorage.removeItem("authToken")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [axiosInstance])

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    })

    const { token, user } = response.data
    localStorage.setItem("authToken", token)
    setUser(user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post("/api/auth/signup", {
      name,
      email,
      password,
    })

    const { token, user } = response.data
    localStorage.setItem("authToken", token)
    setUser(user)
  }

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("authToken")
      setUser(null)
    }
  }

  const resetPassword = async (email: string) => {
    await axiosInstance.post("/api/auth/reset-password", { email })
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

