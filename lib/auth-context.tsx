'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, currentUser as mockUser } from './data'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, email?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (mock)
    const token = localStorage.getItem('accessToken')
    if (token) {
      setUser(mockUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // Mock login (accept any username/password)
    localStorage.setItem('accessToken', 'mock-access-token')
    localStorage.setItem('refreshToken', 'mock-refresh-token')
    setUser(mockUser)
  }

  const signup = async (username: string, password: string, email?: string) => {
    // Mock signup (just create the user)
    localStorage.setItem('accessToken', 'mock-access-token')
    localStorage.setItem('refreshToken', 'mock-refresh-token')
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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
