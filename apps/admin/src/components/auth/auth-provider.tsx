'use client'

import { useEffect } from 'react'
import { authService } from '@/lib/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize auth state on app load
    // This will be handled by individual components using useAuth
  }, [])

  return <>{children}</>
}