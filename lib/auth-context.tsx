'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, currentUser as mockUser } from './data'
import * as auth from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, email?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchCurrentUser(): Promise<User> {
  const accessToken = auth.getAccessToken();
  if (!accessToken) {
    throw new Error("No access token");
  }

  const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const apiUser = await res.json();
  
  // Map API user to our User type (since API user doesn't have all fields, we'll fill with defaults)
  return {
    id: String(apiUser.id),
    name: apiUser.username,
    avatar: apiUser.username.charAt(0).toUpperCase(),
    points: 0,
    rank: 0,
    previousRank: 0,
    correctPredictions: 0,
    totalPredictions: 0,
    memberSince: new Date().toLocaleDateString("fa-IR"),
    achievements: [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const initAuth = async () => {
      const token = auth.getAccessToken()
      if (token) {
        try {
          const userData = await fetchCurrentUser()
          setUser(userData)
        } catch (error) {
          auth.logout()
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    await auth.login(username, password)
    const userData = await fetchCurrentUser()
    setUser(userData)
  }

  const signup = async (username: string, password: string, email?: string) => {
    await auth.signup(username, password, email)
    await auth.login(username, password)
    const userData = await fetchCurrentUser()
    setUser(userData)
  }

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
