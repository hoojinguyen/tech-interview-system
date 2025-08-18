'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Check authentication status on app load
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}