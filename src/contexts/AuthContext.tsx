"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, userAPI } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("auth_token");
    
    if (storedToken) {
      setToken(storedToken)
      // Fetch user profile
      fetchUserProfile(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await userAPI.getProfile(authToken)
      if (response) {
       setUser(response as unknown as User); 
      } else {
      
        logout()
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = (authToken: string, userData: User) => {
    setToken(authToken)
     fetchUserProfile(authToken)
    setUser(userData)
    localStorage.setItem("auth_token", authToken)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  const updateUser = (userData: User) => {
    // setUser(userData)
    console.log(updateUser,"updateUser")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
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
