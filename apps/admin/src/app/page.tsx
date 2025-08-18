'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminHome() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize auth state
    checkAuth()
    setIsInitialized(true)
  }, [checkAuth])

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.push('/admin')
      } else {
        router.push('/admin/login')
      }
    }
  }, [isAuthenticated, isInitialized, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-lg">TP</span>
        </div>
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <p className="text-sm text-gray-500">Loading admin panel...</p>
      </div>
    </div>
  )
}