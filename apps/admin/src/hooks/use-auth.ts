'use client'

import { create } from 'zustand'
import { authService, User, AuthTokens } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => void
  refreshToken: () => Promise<boolean>
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { user } = await authService.login(email, password)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state anyway
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  checkAuth: () => {
    try {
      const isAuthenticated = authService.isAuthenticated()
      const user = isAuthenticated ? authService.getCurrentUser() : null
      set({ user, isAuthenticated })
    } catch (error) {
      console.error('Auth check error:', error)
      set({ user: null, isAuthenticated: false })
    }
  },

  refreshToken: async () => {
    try {
      const newToken = await authService.refreshAccessToken()
      if (newToken) {
        const user = authService.getCurrentUser()
        set({ user, isAuthenticated: true })
        return true
      } else {
        set({ user: null, isAuthenticated: false })
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      set({ user: null, isAuthenticated: false })
      return false
    }
  },
}))

export function useAuth() {
  const router = useRouter()
  const { toast } = useToast()
  const store = useAuthStore()

  const loginWithRedirect = async (email: string, password: string) => {
    try {
      await store.login(email, password)
      toast({
        title: 'Login successful',
        description: 'Welcome to the admin panel!',
      })
      router.push('/admin')
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      })
      throw error
    }
  }

  const logoutWithRedirect = async () => {
    try {
      await store.logout()
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
    }
  }

  return {
    ...store,
    login: loginWithRedirect,
    logout: logoutWithRedirect,
  }
}